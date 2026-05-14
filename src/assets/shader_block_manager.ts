import { preprocessShader } from './preprocess_shader.js';

const BUILTIN_SHADER_BLOCKS = import.meta.glob('../shaders/modules/*.wgsl', {
  import: 'default', eager: true, query: '?raw',
}) as Record<string, string>;

/**
 * Manages reusable shader code blocks that can be imported into shader modules. 
 * Shader blocks are identified by name and can contain any valid WGSL code. 
 * This allows for modular shader development and code reuse across different shader modules.
 * Shader blocks can be registered at runtime, and are also pre-populated with built-in blocks 
 * from the `../shaders/modules/` directory. Shaders can import blocks using the syntax 
 * `#import "blockName.wgsl"`, which will be replaced with the corresponding block code during 
 * shader module creation.
 * 
 */
export class ShaderBlockManager {
    private _blocks: Record<string, string> = {};

    constructor() {
      this._registerBuiltinShaderBlocks();
    }

    importShaderBlocks(code: string, defines?: Record<string, string>): string {
      defines ??= {};
      code = preprocessShader(code, defines);
      return code.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm, (_, name) => this.getShaderBlock(name, defines));
    }

    /**
     * Registers a shader block by name, making it available for import by shaders.
     * @param name - name of the shader block
     * @param code - WGSL code of the shader block
     */
    registerShaderBlock(name: string, code: string): void {
      this._blocks[name] = code;
    }

    /**
     * Retrieves the WGSL code for a registered shader block by name.
     * @param name - name of the shader block
     * @returns WGSL code of the shader block, or a placeholder comment if not found
     */
    getShaderBlock(name: string, defines?: Record<string, string>): string {
      let code = this._blocks[name];
      if (code) {
        code = preprocessShader(code, defines);
        code = code.replace(/^#import\s+"(.+?)\.wgsl"\s*$/gm, (_, name) => this.getShaderBlock(name, defines));
      } else {
        console.warn(`Missing shader block: ${name}`);
      }
      return code ?? `/* Missing shader block: ${name} */`;
    }

    _registerBuiltinShaderBlocks(): void {
      for (const [path, code] of Object.entries(BUILTIN_SHADER_BLOCKS)) {
        const name = path.split('/').pop()!.replace('.wgsl', '');
        this.registerShaderBlock(name, code);
      }
    }
}
