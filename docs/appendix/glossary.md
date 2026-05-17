# Appendix D: Glossary

[Contents](../crafty.md) | [Previous](math-ref.md)

**ACES** — Academy Color Encoding System. A standardized color space and tone mapping curve used for filmic HDR rendering.

**AABB** — Axis-Aligned Bounding Box. A rectangular box whose edges are aligned with the coordinate axes, used for fast collision and culling tests.

**BRDF** — Bidirectional Reflectance Distribution Function. Describes how light reflects from a surface at a given point, as a function of incoming and outgoing directions.

**Bloom** — A post-processing effect that simulates lens glare by blurring bright regions of an image and adding them back.

**Cascade Shadow Map (CSM)** — A technique for directional light shadows that splits the view frustum into multiple depth ranges, each with its own shadow map resolution.

**Clip Space** — The coordinate space after the projection matrix transform. In WebGPU, clip-space depth is [0, 1].

**Compute Shader** — A GPU shader stage that performs general-purpose computation, not tied to rendering geometry.

**Cook-Torrance** — A microfacet BRDF model using the GGX normal distribution, Smith geometry function, and Schlick Fresnel approximation.

**DDA** — Digital Differential Analyzer. An algorithm for traversing a voxel grid along a ray, used for block ray casting.

**Deferred Shading** — A rendering technique where surface properties are written to a G-buffer in a first pass and lighting is computed in a separate pass.

**Depth of Field (DoF)** — A post-processing effect simulating camera lens defocus, where objects at a specific distance are sharp and others are blurred.

**Forward Rendering** — A rendering technique where lighting is computed per-vertex or per-fragment during the geometry pass, as opposed to deferred.

**Fragment Shader** — The GPU shader stage that computes the color of each rasterised pixel fragment.

**Fresnel** — The phenomenon where the reflectance of a surface increases at glancing angles. The Schlick approximation is commonly used in PBR.

**Frustum Culling** — The process of determining whether an object's bounding volume intersects the camera's view frustum, skipping objects outside the view.

**G-Buffer** — Geometry Buffer. A set of textures storing surface properties (albedo, normal, depth, roughness, metallic) for deferred shading.

**GGX** — A normal distribution function (NDF) used in the Cook-Torrance BRDF, characterized by its specular highlight shape with long tails.

**God Rays** — Volumetric light shafts, also known as crepuscular rays, caused by light scattering through partially occluded volumes.

**HDR** — High Dynamic Range. A rendering pipeline that uses floating-point textures to represent a wider range of brightness values than standard 8-bit sRGB.

**IBL** — Image-Based Lighting. A technique that uses an HDR environment map to illuminate surfaces with distant light.

**LOD** — Level of Detail. Simplified versions of geometry used at greater distances to reduce rendering cost.

**Material** — A combination of shader code, textures, and parameters that defines the appearance of a surface.

**NDC** — Normalized Device Coordinates. The coordinate space after the perspective divide (x∈[-1,1], y∈[-1,1], z∈[0,1] for WebGPU).

**PBR** — Physically Based Rendering. A shading approach that models light transport using physically accurate BRDFs and energy-conserving equations.

**PCF** — Percentage-Closer Filtering. A shadow filtering technique that samples the shadow map multiple times with a comparison sampler and averages the results.

**Pipeline** — An immutable GPU state object combining shaders, vertex layout, blend state, depth state, and primitive configuration.

**Render Pass** — A phase of GPU work between `beginRenderPass()` and `end()`, targeting a set of color and depth attachments.

**Render Graph** — A dependency graph of passes, rebuilt every frame from persistent pass instances. Passes declare read/write resource usage via a typed builder; the graph compiler validates, culls, topologically sorts, and binds physical resources from a pooled cache, then executes the survivors into a single command buffer. See [`src/renderer/render_graph/`](../../src/renderer/render_graph/).

**SSAO** — Screen-Space Ambient Occlusion. A technique that estimates ambient occlusion by sampling the depth buffer around each pixel.

**SSGI** — Screen-Space Global Illumination. A technique that estimates indirect light bounces using the G-buffer and previous frame color.

**TAA** — Temporal Anti-Aliasing. A technique that reduces aliasing by jittering the sample position each frame and blending with previous frames.

**Tone Mapping** — The process of converting HDR color values to the display's dynamic range (usually SDR).

**TRS** — Translation-Rotation-Scale. The decomposition of a local transform into its three component transforms.

**Vertex Shader** — The GPU shader stage that transforms vertices from model space to clip space.

**VSM** — Variance Shadow Maps. A shadow technique that stores depth and depth-squared to enable pre-filtered soft shadows.

**WebGPU** — A modern web graphics API providing explicit, low-overhead access to GPU functionality, compatible with D3D12, Metal, and Vulkan.

**WGSL** — WebGPU Shading Language. The shader language for WebGPU, designed for safe, portable GPU programming on the web.
