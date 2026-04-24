Crafty is a typescript application that includes a WebGPU rendering and game engine that will be used to implement
a minecraft clone.

The rendering engine will be a render graph architecture supporting multi-pass deferred rendering. It will be render to
an HDR display. The rendering features will include cascade shadow maps from a directional light representing the sun;
sky rendering using an HDR cubemap; TAA; SSAO; PBR; DOF; Bloom; godrays; water; point and spot lights; particle systems;
optional projection textures for spot lights.

Assets will include textures, shaders, mesh, particle system. Textures can be 2D, 3D, or Cube, and include color textures,
normal maps, hdr color.

The game engine will be object/component. Components will include camera, player, light, mesh, particle.

Use PascalCase for classes; camelCase for methods and variables, _privateMembers, and snake_case for files.

Make sure matrices are column-major for WebGPU. Make sure to winding order for mesh triangles is correct so faces aren't
incorrectly backface culled.

Create a test that uses the library to render a cube on a plane with a directional light with shadows.
