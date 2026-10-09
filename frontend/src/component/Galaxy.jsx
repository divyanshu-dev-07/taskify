import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uMouseActiveFactor;
uniform bool uMouseRepulsion;
uniform bool uTransparent;
varying vec2 vUv;

#define NUM_LAYER 4.0
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  return tris(x) * 2.0 - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 k = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + k.xyz) * 6.0 - k.www);
  return c.z * mix(k.xxx, clamp(p - k.xxx, 0.0, 1.0), c.y);
}

float star(vec2 uv, float flare) {
  float d = length(uv);
  float brightness = (0.05 * uGlowIntensity) / max(d, 0.001);
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  brightness += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  brightness += rays * 0.3 * flare * uGlowIntensity;
  return brightness * smoothstep(1.0, 0.2, d);
}

vec3 starLayer(vec2 uv) {
  vec3 color = vec3(0.0);
  vec2 gridUv = fract(uv) - 0.5;
  vec2 cellId = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 cell = cellId + vec2(float(x), float(y));
      float seed = hash21(cell);
      float size = fract(seed * 345.32);
      float flare = smoothstep(0.9, 1.0, size) * tri(uStarSpeed / (3.0 * seed + 1.0));
      vec3 base = vec3(
        smoothstep(0.2, 1.0, hash21(cell + 1.0)) + 0.2,
        smoothstep(0.2, 1.0, hash21(cell + 2.0)) * seed,
        smoothstep(0.2, 1.0, hash21(cell + 3.0)) + 0.2
      );
      float hue = atan(base.g - base.r, base.b - base.r) / 6.28318 + 0.5;
      float saturation = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      base = hsv2rgb(vec3(fract(hue + uHueShift / 360.0), saturation, max(max(base.r, base.g), base.b)));

      vec2 drift = vec2(
        tris(seed * 34.0 + uTime * uSpeed / 10.0),
        tris(seed * 38.0 + uTime * uSpeed / 30.0)
      ) - 0.5;
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      color += star(gridUv - vec2(float(x), float(y)) - drift, flare) * size * base * twinkle;
    }
  }

  return color;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mousePos = (uMouse * uResolution.xy - focalPx) / uResolution.y;

  if (uMouseRepulsion && uMouseActiveFactor > 0.0) {
    vec2 away = uv - mousePos;
    uv += normalize(away + vec2(0.0001)) * (0.08 / (length(away) + 0.2)) * uMouseActiveFactor;
  } else {
    uv += (uMouse - 0.5) * 0.1 * uMouseActiveFactor;
  }

  float angle = uTime * uRotationSpeed;
  uv = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 color = vec3(0.0);
  for (float layer = 0.0; layer < 1.0; layer += 1.0 / NUM_LAYER) {
    float depth = fract(layer + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    color += starLayer(uv * scale + layer * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = min(smoothstep(0.0, 0.3, length(color)), 1.0);
    gl_FragColor = vec4(color, alpha);
  } else {
    gl_FragColor = vec4(color, 1.0);
  }
}
`;

export default function Galaxy({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  transparent = true,
  ...rest
}) {
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, active: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new Renderer({ alpha: transparent, premultipliedAlpha: false });
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, transparent ? 0 : 1);

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new Color(1, 1, 1) },
        uFocal: { value: new Float32Array(focal) },
        uRotation: { value: new Float32Array(rotation) },
        uStarSpeed: { value: starSpeed },
        uDensity: { value: density },
        uHueShift: { value: hueShift },
        uSpeed: { value: speed },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseActiveFactor: { value: 0 },
        uGlowIntensity: { value: glowIntensity },
        uSaturation: { value: saturation },
        uMouseRepulsion: { value: mouseRepulsion },
        uTwinkleIntensity: { value: twinkleIntensity },
        uRotationSpeed: { value: rotationSpeed },
        uTransparent: { value: transparent },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      if (!width || !height) return;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    }

    function handleMouseMove(event) {
      const bounds = container.getBoundingClientRect();
      mouseRef.current.x = (event.clientX - bounds.left) / bounds.width;
      mouseRef.current.y = 1 - (event.clientY - bounds.top) / bounds.height;
      mouseRef.current.active = 1;
    }

    function handleMouseLeave() {
      mouseRef.current.active = 0;
    }

    let frameId;
    function render(time) {
      if (!disableAnimation) {
        program.uniforms.uTime.value = time * 0.001;
        program.uniforms.uStarSpeed.value = (time * 0.001 * starSpeed) / 10;
      }
      program.uniforms.uMouse.value[0] += (mouseRef.current.x - program.uniforms.uMouse.value[0]) * 0.05;
      program.uniforms.uMouse.value[1] += (mouseRef.current.y - program.uniforms.uMouse.value[1]) * 0.05;
      program.uniforms.uMouseActiveFactor.value += (mouseRef.current.active - program.uniforms.uMouseActiveFactor.value) * 0.05;
      renderer.render({ scene: mesh });
      frameId = requestAnimationFrame(render);
    }

    container.appendChild(gl.canvas);
    resize();
    window.addEventListener("resize", resize);
    if (mouseInteraction) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    focal, rotation, starSpeed, density, hueShift, disableAnimation, speed,
    mouseInteraction, glowIntensity, saturation, mouseRepulsion,
    twinkleIntensity, rotationSpeed, transparent,
  ]);

  return <div ref={containerRef} className="relative h-full w-full" {...rest} />;
}