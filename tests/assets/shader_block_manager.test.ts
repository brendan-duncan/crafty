import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ShaderBlockManager } from '../../src/assets/shader_block_manager.js';

describe('ShaderBlockManager', () => {
  let manager: ShaderBlockManager;

  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    manager = new ShaderBlockManager();
  });

  describe('registerShaderBlock / getShaderBlock', () => {
    it('should register and retrieve a block', () => {
      manager.registerShaderBlock('test_util', 'fn util() {}');
      expect(manager.getShaderBlock('test_util')).toBe('fn util() {}');
    });

    it('should return a placeholder for a missing block', () => {
      const result = manager.getShaderBlock('nonexistent');
      expect(result).toContain('Missing shader block');
      expect(result).toContain('nonexistent');
    });

    it('should warn when a block is missing', () => {
      manager.getShaderBlock('missing');
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Missing shader block'));
    });

    it('should overwrite an existing block', () => {
      manager.registerShaderBlock('test_block', 'v1');
      manager.registerShaderBlock('test_block', 'v2');
      expect(manager.getShaderBlock('test_block')).toBe('v2');
    });

    it('should preprocess block code on retrieval', () => {
      const code = [
        '#define FEATURE',
        '#ifdef FEATURE',
        'fn feature() {}',
        '#endif',
      ].join('\n');
      manager.registerShaderBlock('feature_block', code);
      expect(manager.getShaderBlock('feature_block')).toBe('fn feature() {}');
    });
  });

  describe('importShaderBlocks', () => {
    it('should return code unchanged when there are no imports', () => {
      const code = 'fn main() {}';
      expect(manager.importShaderBlocks(code)).toBe(code);
    });

    it('should replace a single #import with block code', () => {
      manager.registerShaderBlock('util', 'fn util() {}');
      expect(manager.importShaderBlocks('#import "util.wgsl"')).toBe('fn util() {}');
    });

    it('should replace multiple #import lines', () => {
      manager.registerShaderBlock('a', 'fn a() {}');
      manager.registerShaderBlock('b', 'fn b() {}');
      const code = [
        '#import "a.wgsl"',
        '#import "b.wgsl"',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn a() {}\nfn b() {}');
    });

    it('should resolve nested imports recursively', () => {
      manager.registerShaderBlock('inner', 'fn inner() {}');
      manager.registerShaderBlock('outer', '#import "inner.wgsl"');
      expect(manager.importShaderBlocks('#import "outer.wgsl"')).toBe('fn inner() {}');
    });

    it('should handle deeply nested imports', () => {
      manager.registerShaderBlock('leaf', 'fn leaf() {}');
      manager.registerShaderBlock('mid', '#import "leaf.wgsl"');
      manager.registerShaderBlock('root', '#import "mid.wgsl"');
      expect(manager.importShaderBlocks('#import "root.wgsl"')).toBe('fn leaf() {}');
    });
  });

  describe('conditional imports (#import inside #ifdef / #else)', () => {
    it('should include #import inside #ifdef when the macro is defined', () => {
      manager.registerShaderBlock('feature', 'fn feature() {}');
      const code = [
        '#define USE_FEATURE',
        '#ifdef USE_FEATURE',
        '#import "feature.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn feature() {}');
    });

    it('should exclude #import inside #ifdef when the macro is not defined', () => {
      manager.registerShaderBlock('feature', 'fn feature() {}');
      const code = [
        '#ifdef USE_FEATURE',
        '#import "feature.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('');
    });

    it('should include #import in #else when the #if condition is false', () => {
      manager.registerShaderBlock('fallback', 'fn fallback() {}');
      const code = [
        '#if 0',
        '#import "excluded.wgsl"',
        '#else',
        '#import "fallback.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn fallback() {}');
    });

    it('should include #import in #elif branch when condition matches', () => {
      manager.registerShaderBlock('b_impl', 'fn b_impl() {}');
      const code = [
        '#define B',
        '#if defined(A)',
        '#import "a_impl.wgsl"',
        '#elif defined(B)',
        '#import "b_impl.wgsl"',
        '#else',
        '#import "default_impl.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn b_impl() {}');
    });

    it('should include #import in #else when no #elif matches', () => {
      manager.registerShaderBlock('default_impl', 'fn default_impl() {}');
      const code = [
        '#if defined(A)',
        '#import "a_impl.wgsl"',
        '#elif defined(B)',
        '#import "b_impl.wgsl"',
        '#else',
        '#import "default_impl.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn default_impl() {}');
    });
  });

  describe('nested conditional imports', () => {
    it('should handle #ifdef inside #ifdef controlling imports', () => {
      manager.registerShaderBlock('inner', 'fn inner() {}');
      const code = [
        '#define OUTER',
        '#ifdef OUTER',
        '#define INNER',
        '#ifdef INNER',
        '#import "inner.wgsl"',
        '#endif',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn inner() {}');
    });

    it('should fall to inner #else when outer is active but inner define is absent', () => {
      manager.registerShaderBlock('inner', 'fn inner() {}');
      const code = [
        '#define OUTER',
        '#ifdef OUTER',
        '#ifdef INNER',
        '#import "inner.wgsl"',
        '#else',
        'fn fallback() {}',
        '#endif',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn fallback() {}');
    });

    it('should exclude everything when outer condition is false', () => {
      manager.registerShaderBlock('inner', 'fn inner() {}');
      const code = [
        '#ifdef OUTER',
        '#define INNER',
        '#ifdef INNER',
        '#import "inner.wgsl"',
        '#endif',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('');
    });

    it('should handle import inside #if inside #else inside #ifdef', () => {
      manager.registerShaderBlock('feature', 'fn feature() {}');
      manager.registerShaderBlock('fallback', 'fn fallback() {}');
      const code = [
        '#define USE_FEATURE',
        '#ifdef USE_FEATURE',
        '#if 1',
        '#import "feature.wgsl"',
        '#else',
        '#import "fallback.wgsl"',
        '#endif',
        '#else',
        '#import "fallback.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn feature() {}');
    });
  });

  describe('preprocessing interaction with imports', () => {
    it('should preprocess the imported block in its own scope', () => {
      manager.registerShaderBlock('conditional', [
        '#define A',
        '#ifdef A',
        'fn from_a() {}',
        '#endif',
      ].join('\n'));
      expect(manager.importShaderBlocks('#import "conditional.wgsl"')).toBe('fn from_a() {}');
    });

    it('should preprocess the imported block with its own defines', () => {
      manager.registerShaderBlock('conditional', [
        '#define B',
        '#ifdef B',
        'fn from_b() {}',
        '#endif',
      ].join('\n'));
      expect(manager.importShaderBlocks('#import "conditional.wgsl"')).toBe('fn from_b() {}');
    });

    it('should strip conditional code from imported block when condition is false', () => {
      manager.registerShaderBlock('conditional', [
        '#ifdef A',
        'fn from_a() {}',
        '#endif',
      ].join('\n'));
      expect(manager.importShaderBlocks('#import "conditional.wgsl"')).toBe('');
    });

    it('should handle imports whose blocks contain further preprocessor directives', () => {
      manager.registerShaderBlock('math', 'fn add(a: f32, b: f32) -> f32 { return a + b; }');
      const code = [
        '#define USE_MATH',
        '#ifdef USE_MATH',
        '#import "math.wgsl"',
        '#endif',
      ].join('\n');
      expect(manager.importShaderBlocks(code)).toBe('fn add(a: f32, b: f32) -> f32 { return a + b; }');
    });
  });

  describe('built-in shader blocks', () => {
    it('should load built-in blocks from disk', () => {
      const code = manager.getShaderBlock('camera');
      expect(code).toBeTruthy();
      expect(code).not.toContain('Missing shader block');
    });

    it('should allow overwriting a built-in block', () => {
      manager.registerShaderBlock('camera', 'fn custom() {}');
      expect(manager.getShaderBlock('camera')).toBe('fn custom() {}');
    });
  });
});
