import{a as y,c as b,P,R as x}from"./render_graph-DOejAKJF.js";const B=`@vertex fn vs(@builtin(vertex_index) vi: u32) -> @builtin(position) vec4<f32> {
  let pos = array(vec2(-1.0,-1.0), vec2(3.0,-1.0), vec2(-1.0,3.0));
  return vec4(pos[vi], 0.0, 1.0);
}`,G=`
struct TimeUniforms { time: vec4<f32>, }
@group(0) @binding(0) var<uniform> u: TimeUniforms;
@fragment fn fs(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
  let p = pos.xy / 800.0;
  let t = u.time.x;
  let r = sin(p.x * 12.0 + t * 1.3) * 0.5 + 0.5;
  let g = cos(p.y * 10.0 + t * 0.9) * 0.5 + 0.5;
  let b = sin((p.x + p.y) * 8.0 + t * 1.1) * 0.5 + 0.5;
  return vec4(r, g, b, 1);
}`;function R(e,i,t,o,a=112){const u=e.createBindGroupLayout({label:`${i}BGL`,entries:[{binding:0,visibility:GPUShaderStage.FRAGMENT,buffer:{type:"uniform"}}]}),r=e.createBuffer({label:`${i}UBO`,size:a,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),l=e.createBindGroup({label:`${i}BG`,layout:u,entries:[{binding:0,resource:{buffer:r}}]}),p=e.createShaderModule({label:`${i}Shader`,code:B+t}),c=Array.isArray(o)?o:[o];return{pipeline:e.createRenderPipeline({label:`${i}Pipeline`,layout:e.createPipelineLayout({bindGroupLayouts:[u]}),vertex:{module:p,entryPoint:"vs"},fragment:{module:p,entryPoint:"fs",targets:c.map(s=>({format:s}))},primitive:{topology:"triangle-list"}}),uniformBuf:r,uniformBg:l,uboSize:a,scratch:new Float32Array(Math.max(16,a/4))}}async function w(){const e=document.getElementById("canvas"),i=document.getElementById("stats"),t=await y.create(e,{enableErrorHandling:!0}),o=t.device,a=new P(o),u=t.format,r={proc:R(o,"Procedural",G,u,16)},l=b(null).attach();new ResizeObserver(()=>{const s=Math.max(1,Math.round(e.clientWidth*devicePixelRatio)),n=Math.max(1,Math.round(e.clientHeight*devicePixelRatio));s===e.width&&n===e.height||(e.width=s,e.height=n,a.trimUnused())}).observe(e);let c=0;function d(){t.update(),t.deltaTime>0&&(c+=(1/t.deltaTime-c)*.1,i.textContent=`${c.toFixed(0)} fps | Procedural`);const s=t.elapsedTime,n=new x(t,a),g=n.setBackbuffer("canvas");n.addPass("Procedural","render",h=>{h.write(g,"attachment",{loadOp:"clear",storeOp:"store",clearValue:[0,0,0,1]}),h.setExecute(v=>{r.proc.scratch[0]=s,t.queue.writeBuffer(r.proc.uniformBuf,0,new Float32Array(r.proc.scratch.buffer,0,r.proc.uboSize/4));const m=v.renderPassEncoder;m.setPipeline(r.proc.pipeline),m.setBindGroup(0,r.proc.uniformBg),m.draw(3)})});const f=n.compile();l.setGraph(n,f),n.execute(f),requestAnimationFrame(d)}requestAnimationFrame(d)}w().catch(e=>{document.body.innerHTML=`<pre style="color:red;padding:1rem">${e.message??e}</pre>`,console.error(e)});
