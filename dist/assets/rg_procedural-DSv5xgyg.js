import{R as v}from"./render_context-CCtKvuOz.js";import{P as y,R as b}from"./render_graph-B4EAUTFL.js";const P=`@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {
  let pos = array(vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  return vec4(pos[vi], 0.0, 1.0);
}`,x=`
struct TimeUniforms { time: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: TimeUniforms;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let p = pos.xy / 800.0;
  let t = u.time.x;
  let r = sin(p.x * 12.0 + t * 1.3) * 0.5 + 0.5;
  let g = cos(p.y * 10.0 + t * 0.9) * 0.5 + 0.5;
  let b = sin((p.x + p.y) * 8.0 + t * 1.1) * 0.5 + 0.5;
  return vec4(r, g, b, 1);
}`;function B(e,o,t,i,a=112){const u=e.createBindGroupLayout({label:`${o}BGL`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createBuffer({label:`${o}UBO`,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),d=e.createBindGroup({label:`${o}BG`,layout:u,entries:[{binding:0,resource:{buffer:r}}]}),s=e.createShaderModule({label:`${o}Shader`,code:P+t}),l=Array.isArray(i)?i:[i];return{pipeline:e.createRenderPipeline({label:`${o}Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[u]}),vertex:{module:s,entryPoint:"vs"},fragment:{module:s,entryPoint:"fs",targets:l.map(n=>({format:n}))},primitive:{topology:"triangle-list"}}),uniformBuf:r,uniformBg:d,uboSize:a,scratch:new Float32Array(Math.max(16,a/4))}}async function R(){const e=document.getElementById("canvas"),o=document.getElementById("stats"),t=await v.create(e,{enableErrorHandling:!0}),i=t.device,a=new y(i),u=t.format,r={proc:B(i,"Procedural",x,u,16)};new ResizeObserver(()=>{const c=Math.max(1,Math.round(e.clientWidth*devicePixelRatio)),n=Math.max(1,Math.round(e.clientHeight*devicePixelRatio));c===e.width&&n===e.height||(e.width=c,e.height=n,a.trimUnused())}).observe(e);let s=0;function l(){t.update(),t.deltaTime>0&&(s+=(1/t.deltaTime-s)*.1,o.textContent=`${s.toFixed(0)} fps | Procedural`);const c=t.elapsedTime,n=new b(t,a),f=n.setBackbuffer("canvas");n.addPass("Procedural","render",m=>{m.write(f,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),m.setExecute(g=>{r.proc.scratch[0]=c,t.queue.writeBuffer(r.proc.uniformBuf,0,new Float32Array(r.proc.scratch.buffer,0,r.proc.uboSize/4));const p=g.renderPassEncoder;p.setPipeline(r.proc.pipeline),p.setBindGroup(0,r.proc.uniformBg),p.draw(3)})});const h=n.compile();n.execute(h),requestAnimationFrame(l)}requestAnimationFrame(l)}R().catch(e=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${e.message??e}</pre>`,console.error(e)});
