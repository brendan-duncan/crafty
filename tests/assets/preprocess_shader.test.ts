import { describe, it, expect } from 'vitest';
import { preprocessShader } from '../../src/assets/preprocess_shader.js';

describe('preprocessShader', () => {
  describe('#define / #undef', () => {
    it('should define a macro', () => {
      const code = [
        '#define FOO',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should undefine a macro', () => {
      const code = [
        '#define FOO',
        '#undef FOO',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should define a macro with value', () => {
      const code = [
        '#define FOO 1',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });
  });

  describe('#if / #elif / #else / #endif', () => {
    it('should include code when condition is true', () => {
      const code = [
        '#define FOO',
        '#if defined(FOO)',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude code when condition is false', () => {
      const code = [
        '#if defined(FOO)',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should handle #if 0', () => {
      const code = [
        '#if 0',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should handle #if 1', () => {
      const code = [
        '#if 1',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should pick the #if branch when true', () => {
      const code = [
        '#define FOO',
        '#if defined(FOO)',
        'if_branch',
        '#else',
        'else_branch',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('if_branch');
    });

    it('should pick the #else branch when #if is false', () => {
      const code = [
        '#if defined(FOO)',
        'if_branch',
        '#else',
        'else_branch',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('else_branch');
    });

    it('should pick the matching #elif branch', () => {
      const code = [
        '#define B',
        '#if defined(A)',
        'a_branch',
        '#elif defined(B)',
        'b_branch',
        '#elif defined(C)',
        'c_branch',
        '#else',
        'else_branch',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('b_branch');
    });

    it('should fall through to #else when no #elif matches', () => {
      const code = [
        '#if defined(A)',
        'a_branch',
        '#elif defined(B)',
        'b_branch',
        '#else',
        'else_branch',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('else_branch');
    });

    it('should produce empty when no branch matches and no #else', () => {
      const code = [
        '#if defined(A)',
        'a_branch',
        '#elif defined(B)',
        'b_branch',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });
  });

  describe('logical operators', () => {
    it('should support !', () => {
      const code = [
        '#if !defined(FOO)',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should support &&', () => {
      const code = [
        '#define A',
        '#define B',
        '#if defined(A) && defined(B)',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when && has a false operand', () => {
      const code = [
        '#define B',
        '#if defined(A) && defined(B)',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support ||', () => {
      const code = [
        '#define A',
        '#if defined(A) || defined(B)',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when both || operands are false', () => {
      const code = [
        '#if defined(A) || defined(B)',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support combined && and ||', () => {
      const code = [
        '#define A',
        '#define C',
        '#if defined(A) && defined(B) || defined(C)',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should support parentheses', () => {
      const code = [
        '#define A',
        '#define C',
        '#if defined(A) && (defined(B) || defined(C))',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when parenthesized group is false', () => {
      const code = [
        '#define A',
        '#if defined(A) && (defined(B) || defined(C))',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });
  });

  describe('#if with comparison operators', () => {
    it('should support == with numeric define values', () => {
      const code = [
        '#define X 5',
        '#if X == 5',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when == does not match', () => {
      const code = [
        '#define X 5',
        '#if X == 3',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support !=', () => {
      const code = [
        '#define X 5',
        '#if X != 3',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when != matches', () => {
      const code = [
        '#define X 5',
        '#if X != 5',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support >', () => {
      const code = [
        '#define X 5',
        '#if X > 3',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when > is false', () => {
      const code = [
        '#define X 2',
        '#if X > 3',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support <', () => {
      const code = [
        '#define X 2',
        '#if X < 3',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should support >=', () => {
      const code = [
        '#define X 5',
        '#if X >= 5',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude when >= is false', () => {
      const code = [
        '#define X 4',
        '#if X >= 5',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should support <=', () => {
      const code = [
        '#define X 3',
        '#if X <= 3',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should evaluate undefined identifiers as 0', () => {
      const code = [
        '#if UNDEFINED == 0',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should combine comparisons with &&', () => {
      const code = [
        '#define X 5',
        '#define Y 10',
        '#if X > 2 && Y < 20',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should combine comparisons with ||', () => {
      const code = [
        '#define X 1',
        '#if X == 1 || X == 2',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should compare defines against each other', () => {
      const code = [
        '#define MIN 2',
        '#define MAX 10',
        '#if MIN < MAX',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should handle version number comparisons', () => {
      const code = [
        '#define VERSION 203',
        '#if VERSION >= 200',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should handle #define with 0 in comparison', () => {
      const code = [
        '#define ENABLED 0',
        '#if ENABLED == 0',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should work with defined() inside expressions alongside comparisons', () => {
      const code = [
        '#define X 5',
        '#if defined(X) && X > 0',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should work with #elif using comparisons', () => {
      const code = [
        '#define MODE 2',
        '#if MODE == 1',
        'mode1',
        '#elif MODE == 2',
        'mode2',
        '#else',
        'default',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('mode2');
    });
  });

  describe('#ifdef', () => {
    it('should include code when defined', () => {
      const code = [
        '#define FOO',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should exclude code when not defined', () => {
      const code = [
        '#ifdef FOO',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });
  });

  describe('nested conditionals', () => {
    it('should handle #if nested inside #if', () => {
      const code = [
        '#define A',
        '#define B',
        '#if defined(A)',
        '#if defined(B)',
        'inner',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('inner');
    });

    it('should exclude inner block when outer is false', () => {
      const code = [
        '#if defined(A)',
        '#if defined(B)',
        'inner',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should handle #ifdef inside #ifdef', () => {
      const code = [
        '#define A',
        '#define B',
        '#ifdef A',
        '#ifdef B',
        'inner',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('inner');
    });

    it('should handle #if/#else nested inside #ifdef', () => {
      const code = [
        '#define OUTER',
        '#ifdef OUTER',
        '#define INNER',
        '#if defined(INNER)',
        'inner_if',
        '#else',
        'inner_else',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('inner_if');
    });

    it('should handle three levels of nesting', () => {
      const code = [
        '#define A',
        '#define B',
        '#define C',
        '#ifdef A',
        '#ifdef B',
        '#ifdef C',
        'deep',
        '#endif',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('deep');
    });

    it('should keep inner #else active when outer is active but inner condition fails', () => {
      const code = [
        '#define OUTER',
        '#ifdef OUTER',
        '#ifdef INNER',
        'inner_if',
        '#else',
        'inner_else',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('inner_else');
    });

    it('should exclude everything when outer is false even with inner #else', () => {
      const code = [
        '#ifdef OUTER',
        '#ifdef INNER',
        'inner_if',
        '#else',
        'inner_else',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should handle nested #elif chains', () => {
      const code = [
        '#define X',
        '#if defined(X)',
        '#define Y',
        '#if defined(Y)',
        'y_branch',
        '#elif defined(Z)',
        'z_branch',
        '#else',
        'else_inner',
        '#endif',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('y_branch');
    });
  });

  describe('#import pass-through', () => {
    it('should pass #import through when active', () => {
      const code = '#import "foo.wgsl"';
      expect(preprocessShader(code)).toBe(code);
    });

    it('should pass #import through inside a true #if', () => {
      const code = [
        '#if 1',
        '#import "foo.wgsl"',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('#import "foo.wgsl"');
    });

    it('should strip #import inside a false #if', () => {
      const code = [
        '#if 0',
        '#import "foo.wgsl"',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });

    it('should pass #import in #else when #if is false', () => {
      const code = [
        '#if 0',
        '#import "excluded.wgsl"',
        '#else',
        '#import "included.wgsl"',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('#import "included.wgsl"');
    });

    it('should conditionally include #import inside #ifdef', () => {
      const code = [
        '#define USE_FOO',
        '#ifdef USE_FOO',
        '#import "foo.wgsl"',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('#import "foo.wgsl"');
    });

    it('should exclude #import inside #ifdef when not defined', () => {
      const code = [
        '#ifdef USE_FOO',
        '#import "foo.wgsl"',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });
  });

  describe('initial defines', () => {
    it('should accept initial defines via parameter', () => {
      const code = [
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code, { FOO: '1' })).toBe('keep');
    });

    it('should allow #undef to remove an initial define', () => {
      const code = [
        '#undef FOO',
        '#ifdef FOO',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code, { FOO: '1' })).toBe('');
    });

    it('should allow #define to override an initial define value', () => {
      const code = [
        '#define FOO 0',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code, { FOO: '1' })).toBe('keep');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      expect(preprocessShader('')).toBe('');
    });

    it('should pass through regular code without directives', () => {
      const code = 'fn main() {}';
      expect(preprocessShader(code)).toBe(code);
    });

    it('should preserve indentation of output lines', () => {
      const code = [
        '  fn a() {}',
        '#if 1',
        '  fn b() {}',
        '#endif',
        '  fn c() {}',
      ].join('\n');
      expect(preprocessShader(code)).toBe([
        '  fn a() {}',
        '  fn b() {}',
        '  fn c() {}',
      ].join('\n'));
    });

    it('should handle #if defined with spaces in parentheses', () => {
      const code = [
        '#define FOO',
        '#if defined( FOO )',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should handle multiple top-level conditional blocks', () => {
      const code = [
        '#if 1',
        'first',
        '#endif',
        '#if 0',
        'second',
        '#endif',
        '#if 1',
        'third',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe([
        'first',
        'third',
      ].join('\n'));
    });

    it('should handle define inside true block', () => {
      const code = [
        '#if 1',
        '#define FOO',
        '#endif',
        '#ifdef FOO',
        'keep',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('keep');
    });

    it('should not leak defines from false blocks', () => {
      const code = [
        '#if 0',
        '#define FOO',
        '#endif',
        '#ifdef FOO',
        'excluded',
        '#endif',
      ].join('\n');
      expect(preprocessShader(code)).toBe('');
    });
  });
});
