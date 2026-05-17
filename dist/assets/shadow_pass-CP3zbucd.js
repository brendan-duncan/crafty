var b=Object.defineProperty;var v=(f,n,t)=>n in f?b(f,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):f[n]=t;var a=(f,n,t)=>v(f,typeof n!="symbol"?n+"":n,t);import{P as y,e as P,f as G}from"./pass-CMGsmZgn.js";const x=`// Shadow map rendering shader - outputs depth only

struct CameraUniforms {
  viewProj: mat4x4<f32>,
}

struct ModelUniforms {
  model: mat4x4<f32>,
}

@group(0) @binding(0) var<uniform> camera: CameraUniforms;
@group(1) @binding(0) var<uniform> model: ModelUniforms;

struct VertexInput {
  @location(0) position: vec3<f32>,
}

struct VertexOutput {
  @builtin(position) clip_pos: vec4<f32>,
}

@vertex
fn vs_main(vin: VertexInput) -> VertexOutput {
  let world_pos = model.model * vec4<f32>(vin.position, 1.0);
  var out: VertexOutput;
  out.clip_pos = camera.viewProj * world_pos;
  return out;
}

@fragment
fn fs_main(in: VertexOutput) {
  // Depth is written automatically - no fragment output needed
}
`,S=2048,B=4,M="shadow:directional",U={label:"ShadowMap",format:"depth32float",width:S,height:S,depthOrArrayLayers:B};class g extends y{constructor(t,e,s,r,o){super();a(this,"name","ShadowPass");a(this,"_device");a(this,"_pipeline");a(this,"_modelBgl");a(this,"_cascadeBuffers");a(this,"_cascadeBindGroups");a(this,"_modelBuffers",[]);a(this,"_modelBindGroups",[]);a(this,"_cascades",[]);this._device=t,this._pipeline=e,this._modelBgl=s,this._cascadeBuffers=r,this._cascadeBindGroups=o}static create(t){const{device:e}=t,s=e.createBindGroupLayout({label:"ShadowBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),r=e.createBindGroupLayout({label:"ShadowModelBGL",entries:[{binding:0,visibility:GPUShaderStage.VERTEX,buffer:{type:"uniform"}}]}),o=[],d=[];for(let u=0;u<B;u++){const l=e.createBuffer({label:`ShadowUniformBuffer ${u}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});o.push(l),d.push(e.createBindGroup({label:`ShadowBindGroup ${u}`,layout:s,entries:[{binding:0,resource:{buffer:l}}]}))}const i=t.createShaderModule(x,"ShadowShader"),m=e.createRenderPipeline({label:"ShadowPipeline",layout:e.createPipelineLayout({bindGroupLayouts:[s,r]}),vertex:{module:i,entryPoint:"vs_main",buffers:[{arrayStride:G,attributes:[P[0]]}]},depthStencil:{format:"depth32float",depthWriteEnabled:!0,depthCompare:"less",depthBias:2,depthBiasSlopeScale:2.5,depthBiasClamp:0},primitive:{topology:"triangle-list",cullMode:"back"}});return new g(e,m,r,o,d)}updateScene(t,e,s,r){this._cascades=s.computeCascadeMatrices(e,r)}get cascades(){return this._cascades}addToGraph(t,e){const s=e.cascades.length>0?e.cascades:this._cascades,r=Math.min(s.length,B);let o=t.importPersistentTexture(M,U);for(let d=0;d<r;d++){const i=d,m=s[i],u=o;let l;t.addPass(`ShadowPass.cascade${i}`,"render",_=>{l=_.write(u,"depth-attachment",{depthLoadOp:"clear",depthStoreOp:"store",depthClearValue:1,view:{dimension:"2d",baseArrayLayer:i,arrayLayerCount:1}}),_.setExecute(w=>{this._device.queue.writeBuffer(this._cascadeBuffers[i],0,m.lightViewProj.data.buffer),this._ensureModelBuffers(e.drawItems.length);const c=w.renderPassEncoder;c.setPipeline(this._pipeline),c.setBindGroup(0,this._cascadeBindGroups[i]);for(let h=0;h<e.drawItems.length;h++){const p=e.drawItems[h];this._device.queue.writeBuffer(this._modelBuffers[h],0,p.modelMatrix.data.buffer),c.setBindGroup(1,this._modelBindGroups[h]),c.setVertexBuffer(0,p.mesh.vertexBuffer),c.setIndexBuffer(p.mesh.indexBuffer,"uint32"),c.drawIndexed(p.mesh.indexCount)}})}),o=l}return{shadowMap:o,cascadeCount:r}}_ensureModelBuffers(t){for(;this._modelBuffers.length<t;){const e=this._device.createBuffer({label:`ShadowModelBuffer ${this._modelBuffers.length}`,size:64,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),s=this._device.createBindGroup({layout:this._modelBgl,entries:[{binding:0,resource:{buffer:e}}]});this._modelBuffers.push(e),this._modelBindGroups.push(s)}}destroy(){for(const t of this._cascadeBuffers)t.destroy();for(const t of this._modelBuffers)t.destroy()}}export{g as S,x as s};
