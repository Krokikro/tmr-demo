import{a as ie,b as He}from"./chunk-NVNCX4J7.js";import{b as De,c as P,f as K,g as j}from"./chunk-MBL2NX2W.js";var ge=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`,Ce=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,Ie=`${ge}
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uWarp;
uniform float uBlend;
uniform int uN;
uniform float uB[6];
uniform vec3 uC0[7];
uniform vec3 uC1[7];
uniform vec3 uC2[7];
uniform vec4 uSpot[8];
uniform vec3 uSpotC[8];
uniform vec3 uEdge[6];
uniform float uEdgeAmt;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  float aspect = uRes.x / uRes.y;
  float y = 1.0 - vUv.y;
  vec2 p = vec2(vUv.x * aspect, y) * 1.15;
  float t = uTime;
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.9)), fbm(p + vec2(5.2, 1.3) - t * 0.7));
  vec2 r = vec2(fbm(p + 2.1 * q + vec2(1.7, 9.2) + 0.21 * t), fbm(p + 2.1 * q + vec2(8.3, 2.8) - 0.17 * t));
  float f = fbm(p * 0.9 + 2.4 * r);

  // \u0433\u0440\u0430\u043D\u0438\u0446\u0430 \u043C\u0435\u0436\u0434\u0443 \u0431\u043B\u043E\u043A\u0430\u043C\u0438 \u043F\u043B\u044B\u0432\u0451\u0442, \u043A\u0430\u043A \u0436\u0438\u0434\u043A\u043E\u0441\u0442\u044C
  float yw = y + (f - 0.5) * 0.28 * uWarp + (q.x - 0.5) * 0.08 * uWarp;
  vec3 c0 = uC0[0];
  vec3 c1 = uC1[0];
  vec3 c2 = uC2[0];
  vec3 glowC = vec3(0.0);
  float glow = 0.0;
  for (int i = 0; i < 6; i++) {
    if (i >= uN - 1) break;
    float k = smoothstep(uB[i] - uBlend, uB[i] + uBlend, yw);
    c0 = mix(c0, uC0[i + 1], k);
    c1 = mix(c1, uC1[i + 1], k);
    c2 = mix(c2, uC2[i + 1], k);
    // \u0441\u0432\u0435\u0442\u044F\u0449\u0438\u0439\u0441\u044F \u0444\u0440\u043E\u043D\u0442 \xAB\u0432\u043E\u043B\u043D\u044B\xBB \u043D\u0430 \u0441\u0442\u044B\u043A\u0435 \u0431\u043B\u043E\u043A\u043E\u0432
    float e = 1.0 - abs(k * 2.0 - 1.0);
    e = e * e * (3.0 - 2.0 * e);
    glowC += uEdge[i] * e;
    glow += e;
  }
  vec3 col = mix(c0, c1, smoothstep(0.18, 0.82, f));
  col = mix(col, c2, smoothstep(0.45, 1.05, length(q)) * 0.75);
  col = mix(col, c2 * 1.08, pow(smoothstep(0.52, 0.95, r.y), 2.5) * 0.45);
  if (glow > 0.001) {
    float g = clamp(glow, 0.0, 1.0) * uEdgeAmt * (0.55 + 0.45 * smoothstep(0.3, 0.8, f));
    col = mix(col, glowC / glow, g);
  }

  for (int i = 0; i < 8; i++) {
    vec4 s = uSpot[i];
    if (s.w <= 0.001) continue;
    vec2 d = p - vec2(s.x * aspect, s.y) * 1.15;
    float g = exp(-dot(d, d) / (s.z * s.z)) * s.w;
    col = mix(col, uSpotC[i], clamp(g, 0.0, 0.92));
  }
  gl_FragColor = vec4(col, 1.0);
}`,Oe=`${ge}
varying vec2 vUv;
uniform sampler2D uTex;
uniform float uTime;
uniform float uGrain;
uniform float uVignette;
float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}
void main() {
  vec3 col = texture2D(uTex, vUv).rgb;
  float n = hash(gl_FragCoord.xy + fract(uTime) * 37.0) - 0.5;
  col += n * uGrain;
  vec2 d = vUv - 0.5;
  col *= 1.0 - uVignette * dot(d, d) * 1.6;
  gl_FragColor = vec4(col, 1.0);
}`,We=`
uniform vec4 uRect;   // \u0446\u0435\u043D\u0442\u0440 \u0438 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430 \u0432 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u0445 \u044D\u043A\u0440\u0430\u043D\u0430 (-1..1)
uniform float uAspect; // \u0448\u0438\u0440\u0438\u043D\u0430 / \u0432\u044B\u0441\u043E\u0442\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430
uniform float uCam;
vec4 project(vec3 p) {
  float k = uCam / (uCam - p.z);
  vec2 sp = p.xy * k;
  vec2 ndc = uRect.xy + vec2(sp.x, sp.y * uAspect) * uRect.zw;
  return vec4(ndc, clamp(-p.z * 0.15, -0.99, 0.99), 1.0);
}`,ke=`
attribute vec2 aUV;
uniform float uTime;
uniform float uAmp;
uniform float uLift;
uniform float uWidth;
uniform vec2 uPath0;
uniform vec2 uPath1;
uniform vec3 uPtr;
${We}
varying vec3 vN;
varying vec3 vT;
varying vec2 vUV;

vec3 C(float s) {
  float t = uTime;
  vec2 a = mix(uPath0, uPath1, s);
  float x = a.x;
  float y = a.y + uAmp * (0.2 * sin(s * 4.6 + t * 0.5) + 0.09 * sin(s * 9.7 - t * 0.73 + 1.3));
  float z = uAmp * (0.34 * sin(s * 3.7 - t * 0.42) + 0.12 * cos(s * 8.1 + t * 0.61));
  y += uLift * (s - 0.25) * 0.9;
  return vec3(x, y, z);
}
void frameAt(float s, out vec3 c, out vec3 T, out vec3 W, out vec3 N) {
  float e = 0.004;
  c = C(s);
  T = normalize(C(s + e) - C(s - e));
  vec3 B0 = normalize(cross(T, vec3(0.0, 0.0, 1.0)));
  vec3 N0 = cross(B0, T);
  float th = 1.05 * sin(s * 2.7 + uTime * 0.31) + s * 2.4 + uLift * 2.2 + 0.4;
  W = cos(th) * B0 + sin(th) * N0;
  N = cross(T, W);
}
vec3 P(float s, float w, vec3 c, vec3 W, vec3 N) {
  vec3 p = c + W * (w * uWidth);
  p += N * (0.016 * sin(w * 5.0 + s * 26.0 + uTime * 1.6));
  vec2 d = p.xy - uPtr.xy;
  float g = exp(-dot(d, d) / 0.14) * uPtr.z;
  p.z += 0.26 * g;
  p += N * (0.035 * g * sin(length(d) * 16.0 - uTime * 5.0));
  return p;
}
void main() {
  float s = aUV.x;
  float w = aUV.y;
  vec3 c; vec3 T; vec3 W; vec3 N;
  frameAt(s, c, T, W, N);
  vec3 p = P(s, w, c, W, N);
  vec3 pw = P(s, w + 0.02, c, W, N);
  vec3 c2; vec3 T2; vec3 W2; vec3 N2;
  frameAt(s + 0.004, c2, T2, W2, N2);
  vec3 ps = P(s + 0.004, w, c2, W2, N2);
  vN = normalize(cross(ps - p, pw - p));
  vT = normalize(ps - p);
  vUV = aUV;
  gl_Position = project(p);
}`,Ye=`${ge}
varying vec3 vN;
varying vec3 vT;
varying vec2 vUV;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
uniform vec3 uSheen;
uniform vec3 uSheen2;
uniform vec3 uRim;
uniform float uAlpha;
uniform float uMode;
uniform vec3 uL1;
uniform vec3 uL2;
uniform vec3 uSpec; // \u0441\u0438\u043B\u0430 \u0431\u043B\u0438\u043A\u0430, \u0448\u0438\u0440\u0438\u043D\u0430 \u0432\u0434\u043E\u043B\u044C \u043D\u0438\u0442\u0435\u0439, \u0448\u0438\u0440\u0438\u043D\u0430 \u043F\u043E\u043F\u0435\u0440\u0451\u043A
float ward(vec3 N, vec3 T, vec3 B, vec3 H, float ax, float ay) {
  float hN = max(dot(N, H), 0.02);
  float hT = dot(H, T);
  float hB = dot(H, B);
  return exp(-((hT * hT) / (ax * ax) + (hB * hB) / (ay * ay)) / (hN * hN));
}
void main() {
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 N = normalize(vN);
  // \u0434\u0432\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u044F\u044F \u0442\u043A\u0430\u043D\u044C: \u043D\u043E\u0440\u043C\u0430\u043B\u044C \u0432\u0441\u0435\u0433\u0434\u0430 \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043D\u0430 \u0437\u0440\u0438\u0442\u0435\u043B\u044F
  if (dot(N, V) < 0.0) N = -N;
  vec3 B = normalize(cross(N, normalize(vT)));
  vec3 T = normalize(cross(B, N));
  vec3 L1 = normalize(uL1);
  vec3 L2 = normalize(uL2);
  vec3 H1 = normalize(L1 + V);
  vec3 H2 = normalize(L2 + V);
  float ndl = dot(N, L1);
  float diff = clamp(ndl * 0.6 + 0.4, 0.0, 1.0);
  diff *= diff;
  float nv = max(dot(N, V), 0.0);
  float fres = pow(1.0 - nv, 3.0);

  float along = uMode < 0.5 ? vUV.x : (vUV.x * 0.5 + 0.5);
  vec3 base = mix(uColA, uColB, smoothstep(0.0, 1.0, along));
  vec3 col = mix(uColC, base, 0.25 + 0.75 * diff);
  float s1 = ward(N, T, B, H1, uSpec.y, uSpec.z) * uSpec.x;
  float s2 = ward(N, T, B, H2, uSpec.y * 1.6, uSpec.z * 1.8) * uSpec.x * 0.55;
  col += uSheen * s1 * (0.35 + 0.65 * diff);
  col += uSheen2 * s2;
  col += uRim * fres * 0.55;

  float a = uAlpha;
  if (uMode < 0.5) {
    a *= smoothstep(0.0, 0.07, vUV.x) * smoothstep(1.0, 0.9, vUV.x);
  } else {
    // \u0442\u043A\u0430\u043D\u044C \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u044F\u0435\u0442\u0441\u044F \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0435 \u043F\u043E \u043A\u0440\u0443\u0433\u0443, \u0431\u0435\u0437 \u043F\u0440\u044F\u043C\u044B\u0445 \u043A\u0440\u0430\u0451\u0432
    float edge = length(vUV * vec2(1.0, 1.1));
    a *= 1.0 - smoothstep(0.62, 1.02, edge);
  }
  gl_FragColor = vec4(col, a);
}`,Ge=`
attribute vec3 aPos;
attribute vec3 aNrm;
attribute vec3 aTan;
attribute vec2 aUV;
attribute vec3 aAttr;   // \u0437\u0430\u0442\u0435\u043D\u0435\u043D\u0438\u0435 \u0441 \u043B\u0438\u0446\u0435\u0432\u043E\u0439 \u0441\u0442\u043E\u0440\u043E\u043D\u044B, \u0441 \u0438\u0437\u043D\u0430\u043D\u043A\u0438, \u0441\u0432\u043E\u0431\u043E\u0434\u0430
uniform float uTime;
uniform float uBreath;
uniform float uGust;
uniform float uHoverAmp;
uniform vec3 uHover;
uniform vec4 uRip[4];   // \u0446\u0435\u043D\u0442\u0440 \u0432\u043E\u043B\u043D\u044B (\u043C\u0438\u0440) \u0438 \u0441\u0438\u043B\u0430
uniform float uRipAge[4];
uniform vec2 uTilt;     // \u043D\u0430\u043A\u043B\u043E\u043D \u043A\u0430\u043C\u0435\u0440\u044B \u0438 \u043F\u043E\u0432\u043E\u0440\u043E\u0442 \u0432\u043E\u043A\u0440\u0443\u0433 \u0432\u0435\u0440\u0442\u0438\u043A\u0430\u043B\u0438, \u0440\u0430\u0434\u0438\u0430\u043D\u044B
uniform vec3 uCenter;
uniform float uScale;
uniform float uYOff;
${We}
varying vec3 vN;
varying vec3 vT;
varying vec3 vView;
varying vec3 vWorld;
varying vec2 vUV;
varying vec3 vAttr;

float disp(vec3 p, float fr) {
  float t = uTime;
  float d = 0.0;
  // \u0442\u043A\u0430\u043D\u044C \xAB\u0434\u044B\u0448\u0438\u0442\xBB \u0442\u0430\u043C, \u0433\u0434\u0435 \u0432\u0438\u0441\u0438\u0442 \u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E
  d += uBreath * fr * (0.0042 * sin(dot(p, vec3(3.1, 2.3, 2.7)) + t * 0.8) + 0.0028 * sin(dot(p, vec3(-4.3, 3.7, 1.9)) - t * 1.13));
  d += uGust * fr * 0.018 * sin(p.x * 4.0 + p.y * 3.0 - t * 5.0);
  vec3 dh = p - uHover;
  d += uHoverAmp * 0.03 * exp(-dot(dh, dh) / 0.016) * (0.4 + 0.6 * fr);
  for (int i = 0; i < 4; i++) {
    float amp = uRip[i].w;
    if (amp <= 0.001) continue;
    float age = uRipAge[i];
    float r = length(p - uRip[i].xyz);
    float x = r - age * 0.72;
    d += 0.017 * amp * exp(-age * 1.1) * sin(x * 32.0) * exp(-x * x * 40.0) * (0.35 + 0.65 * fr);
  }
  return d;
}
vec3 turnTilt(vec3 c) {
  float cb = cos(uTilt.y); float sb = sin(uTilt.y);
  float vx = c.x * cb + c.z * sb;
  float vz0 = -c.x * sb + c.z * cb;
  float ca = cos(uTilt.x); float sa = sin(uTilt.x);
  return vec3(vx, c.y * ca - vz0 * sa, c.y * sa + vz0 * ca);
}
void main() {
  float fr = aAttr.z;
  vec3 N = normalize(aNrm);
  vec3 T = normalize(aTan - N * dot(aTan, N));
  vec3 B = cross(N, T);
  float e = 0.012;
  float d0 = disp(aPos, fr);
  float dT = disp(aPos + T * e, fr) - d0;
  float dB = disp(aPos + B * e, fr) - d0;
  vec3 p = aPos + N * d0;
  vec3 n = normalize(N - (T * dT + B * dB) / e);
  vN = turnTilt(n);
  vT = turnTilt(T);
  vec3 v = turnTilt(p - vec3(uCenter.x, 0.0, uCenter.z)) * uScale;
  v.y += uYOff;
  vView = v;
  vWorld = p;
  vUV = aUV;
  vAttr = aAttr;
  gl_Position = project(v);
}`,Xe=t=>`${t?`#extension GL_OES_standard_derivatives : enable
`:""}${ge}
varying vec3 vN;
varying vec3 vT;
varying vec3 vView;
varying vec3 vWorld;
varying vec2 vUV;
varying vec3 vAttr;
uniform float uCam;
uniform float uMat;       // 0 \u2014 \u0430\u0442\u043B\u0430\u0441, 1 \u2014 \u0431\u0430\u0440\u0445\u0430\u0442, 2 \u2014 \u043B\u0451\u043D
uniform vec3 uBase;
uniform vec3 uShade;
uniform vec3 uSheen;
uniform vec3 uRimCol;
uniform vec2 uRough;      // \u0448\u0435\u0440\u043E\u0445\u043E\u0432\u0430\u0442\u043E\u0441\u0442\u044C \u0432\u0434\u043E\u043B\u044C \u0438 \u043F\u043E\u043F\u0435\u0440\u0451\u043A \u043D\u0438\u0442\u0435\u0439
uniform float uSpecAmt;
uniform float uSheenAmt;
uniform float uWeave;
uniform float uWeaveScale;
uniform float uExposure;
uniform vec4 uFade;       // \u0446\u0435\u043D\u0442\u0440 \u043D\u0430 \u043F\u043E\u043B\u0443 (x, z), \u043D\u0430\u0447\u0430\u043B\u043E \u0438 \u043A\u043E\u043D\u0435\u0446 \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u0435\u043D\u0438\u044F
uniform float uAlpha;
uniform float uTime;

const float PI = 3.14159265;
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
vec3 toLin(vec3 c) { return pow(c, vec3(2.2)); }
vec3 toSrgb(vec3 c) { return pow(clamp(c, 0.0, 1.0), vec3(1.0 / 2.2)); }
vec3 filmic(vec3 x) {
  // ACES (\u043F\u0440\u0438\u0431\u043B\u0438\u0436\u0435\u043D\u0438\u0435 \u041D\u0430\u0440\u043A\u043E\u0432\u0438\u0447\u0430)
  return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
}
float ggxAniso(vec3 N, vec3 T, vec3 B, vec3 H, float ax, float ay) {
  float hT = dot(H, T) / ax;
  float hB = dot(H, B) / ay;
  float hN = max(dot(N, H), 0.0);
  float d = hT * hT + hB * hB + hN * hN;
  return 1.0 / (PI * ax * ay * d * d);
}
float charlie(float NdH, float r) {
  // \u0440\u0430\u0441\u043F\u0440\u0435\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0432\u043E\u0440\u0441\u0430 (Estevez\u2013Kulla): \u0441\u0432\u0435\u0442\u0438\u0442\u0441\u044F \u043F\u0440\u0438 \u0441\u043A\u043E\u043B\u044C\u0437\u044F\u0449\u0435\u043C \u0432\u0437\u0433\u043B\u044F\u0434\u0435
  float inv = 1.0 / r;
  float s2 = max(1.0 - NdH * NdH, 0.0001);
  return (2.0 + inv) * pow(s2, inv * 0.5) / (2.0 * PI);
}
float schlick(float c, float f0) { return f0 + (1.0 - f0) * pow(1.0 - c, 5.0); }

void main() {
  vec3 V = normalize(vec3(0.0, 0.0, uCam) - vView);
  vec3 N = normalize(vN);
  // \u0442\u043A\u0430\u043D\u044C \u0434\u0432\u0443\u0441\u0442\u043E\u0440\u043E\u043D\u043D\u044F\u044F: \u043D\u043E\u0440\u043C\u0430\u043B\u044C \u043A \u0437\u0440\u0438\u0442\u0435\u043B\u044E, \u0437\u0430\u0442\u0435\u043D\u0435\u043D\u0438\u0435 \u043F\u043B\u0430\u0432\u043D\u043E \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0438\u0442 \u0441 \u043B\u0438\u0446\u0430 \u043D\u0430 \u0438\u0437\u043D\u0430\u043D\u043A\u0443,
  // \u0438\u043D\u0430\u0447\u0435 \u043D\u0430 \u0441\u0438\u043B\u0443\u044D\u0442\u0430\u0445 \u0441\u043A\u043B\u0430\u0434\u043E\u043A \u043F\u043E\u044F\u0432\u043B\u044F\u044E\u0442\u0441\u044F \u0442\u0451\u043C\u043D\u044B\u0435 \u0442\u043E\u0447\u043A\u0438
  float side = dot(N, V);
  float ao = mix(vAttr.y, vAttr.x, smoothstep(-0.2, 0.2, side));
  if (side < 0.0) N = -N;
  vec3 T0 = normalize(vT - N * dot(vT, N));
  vec3 B0 = cross(N, T0);

  // \u2500\u2500 \u043F\u043B\u0435\u0442\u0435\u043D\u0438\u0435 \u0438 \u043D\u0435\u0440\u043E\u0432\u043D\u043E\u0441\u0442\u044C \u043D\u0438\u0442\u0435\u0439: \u043C\u0438\u043A\u0440\u043E\u043D\u043E\u0440\u043C\u0430\u043B\u044C \u0438\u0437 \u043F\u0440\u043E\u0446\u0435\u0434\u0443\u0440\u043D\u043E\u0439 \u0432\u044B\u0441\u043E\u0442\u044B \u2500\u2500
  vec2 uv = vUV * uWeaveScale;
  float fade = 1.0;
  ${t?"vec2 fw = fwidth(uv); fade = 1.0 - smoothstep(0.18, 0.55, max(fw.x, fw.y));":"fade = 0.6;"}
  float slubU = noise(vec2(uv.x * 0.07, floor(uv.y) * 1.37));
  float slubV = noise(vec2(floor(uv.x) * 1.91, uv.y * 0.07));
  vec2 ph = uv * 2.0 * PI;
  float warp = sin(ph.x) * (0.75 + 0.5 * slubV);
  float weft = sin(ph.y) * (0.75 + 0.5 * slubU);
  float over = sign(sin(ph.x * 0.5) * sin(ph.y * 0.5));
  // \u043F\u0440\u043E\u0438\u0437\u0432\u043E\u0434\u043D\u044B\u0435 \u0432\u044B\u0441\u043E\u0442\u044B \u043F\u043E u \u0438 v (\u043F\u043B\u0435\u0442\u0435\u043D\u0438\u0435 \xAB\u043F\u043E\u043B\u043E\u0442\u043D\u043E\xBB)
  float dhu = cos(ph.x) * (0.75 + 0.5 * slubV) * (0.5 + 0.5 * over);
  float dhv = cos(ph.y) * (0.75 + 0.5 * slubU) * (0.5 - 0.5 * over);
  float weaveAmt = uWeave * fade;
  vec3 Nw = normalize(N - weaveAmt * 0.35 * (T0 * dhu + B0 * dhv));
  float weaveShade = 1.0 - weaveAmt * 0.12 * (1.0 - (warp * (0.5 + 0.5 * over) + weft * (0.5 - 0.5 * over)) * 0.5 - 0.5);

  // \u0432\u0434\u043E\u043B\u044C \u0432\u043E\u043B\u043E\u043A\u043E\u043D \u0448\u0451\u043B\u043A\u0430 \u2014 \u0442\u043E\u043D\u043A\u0438\u0435 \u043D\u0435\u0440\u043E\u0432\u043D\u044B\u0435 \u043F\u043E\u043B\u043E\u0441\u044B \u0432 \u0431\u043B\u0438\u043A\u0430\u0445
  float streak = noise(vec2(dot(vUV, vec2(0.0, 1.0)) * 140.0, dot(vUV, vec2(1.0, 0.0)) * 6.0));
  // \xAB\u043F\u0440\u0438\u043C\u044F\u0442\u044B\u0439\xBB \u0432\u043E\u0440\u0441 \u0431\u0430\u0440\u0445\u0430\u0442\u0430
  float crush = noise(vUV * 18.0) * 0.6 + noise(vUV * 57.0) * 0.4;

  vec3 base = toLin(uBase) * (0.96 + 0.08 * noise(vUV * 90.0)) * weaveShade;
  vec3 shade = toLin(uShade);
  vec3 sheenC = toLin(uSheen);
  vec3 rimC = toLin(uRimCol);

  // \u0441\u0442\u0443\u0434\u0438\u0439\u043D\u044B\u0439 \u0441\u0432\u0435\u0442: \u0440\u0438\u0441\u0443\u044E\u0449\u0438\u0439 \u0441\u043B\u0435\u0432\u0430 \u0441\u0432\u0435\u0440\u0445\u0443, \u0437\u0430\u043F\u043E\u043B\u043D\u044F\u044E\u0449\u0438\u0439 \u0441\u043F\u0440\u0430\u0432\u0430, \u043A\u043E\u043D\u0442\u0440\u043E\u0432\u043E\u0439 \u0441\u0437\u0430\u0434\u0438;
  // \u043F\u0440\u043E\u0436\u0435\u043A\u0442\u043E\u0440 \u0441\u0432\u0435\u0442\u0438\u0442 \u043D\u0430 \u043F\u0440\u0435\u0434\u043C\u0435\u0442\u044B, \u043F\u043E\u044D\u0442\u043E\u043C\u0443 \u0442\u043A\u0430\u043D\u044C \u043D\u0430 \u043F\u043E\u043B\u0443 \u043A \u043A\u0440\u0430\u044F\u043C \u0443\u0445\u043E\u0434\u0438\u0442 \u0432 \u0442\u0435\u043C\u043D\u043E\u0442\u0443
  vec2 dxz = vWorld.xz - uFade.xy;
  float spot = 0.12 + 0.88 * exp(-dot(dxz, dxz) / 0.42) * (0.85 + 0.15 * clamp(vWorld.y, 0.0, 1.0));
  vec3 Ls[3];
  Ls[0] = normalize(vec3(-0.6, 0.68, 0.5));
  Ls[1] = normalize(vec3(0.9, 0.18, 0.35));
  Ls[2] = normalize(vec3(0.25, 0.5, -0.83));
  vec3 Lc[3];
  Lc[0] = vec3(1.0, 0.96, 0.9) * 2.6 * spot;
  Lc[1] = vec3(0.7, 0.82, 1.0) * 0.45 * spot;
  // \u043A\u043E\u043D\u0442\u0440\u043E\u0432\u043E\u0439 \u0441\u0432\u0435\u0442 \u0440\u0438\u0441\u0443\u0435\u0442 \u0441\u0438\u043B\u0443\u044D\u0442 \u0441\u043A\u043B\u0430\u0434\u043E\u043A, \u0430 \u043D\u0435 \u043F\u043E\u043B \u0432\u043E\u043A\u0440\u0443\u0433
  Lc[2] = rimC * 2.4 * spot * pow(1.0 - max(dot(Nw, V), 0.0), 1.5);

  float NdV = max(dot(Nw, V), 0.0001);
  vec3 R = reflect(-V, Nw);
  vec3 col = vec3(0.0);
  for (int i = 0; i < 3; i++) {
    vec3 L = Ls[i];
    vec3 H = normalize(L + V);
    float NdLr = dot(Nw, L);
    float NdL = max(NdLr, 0.0);
    float NdH = max(dot(Nw, H), 0.0);
    float direct = mix(1.0, ao, 0.55);
    if (uMat < 0.5) {
      // \u0430\u0442\u043B\u0430\u0441: \u043C\u044F\u0433\u043A\u0438\u0439 \u0440\u0430\u0441\u0441\u0435\u044F\u043D\u043D\u044B\u0439 \u0441\u0432\u0435\u0442 + \u0434\u0432\u0430 \u0430\u043D\u0438\u0437\u043E\u0442\u0440\u043E\u043F\u043D\u044B\u0445 \u0431\u043B\u0438\u043A\u0430 (\u043E\u0441\u043D\u043E\u0432\u0430 \u0438 \u0443\u0442\u043E\u043A)
      float wrap = max((NdLr + 0.2) / 1.2, 0.0);
      vec3 diff = base * wrap / PI;
      float ax = uRough.x * (0.8 + 0.4 * streak);
      float ay = uRough.y;
      float D1 = ggxAniso(Nw, T0, B0, H, ax, ay);
      float D2 = ggxAniso(Nw, B0, T0, H, ax * 1.4, ay * 1.3);
      float F = schlick(max(dot(H, V), 0.0), 0.06);
      float spec = (D1 + 0.4 * D2) * F / (4.0 * max(NdL, 0.08) * NdV + 0.25) * NdL;
      float sh = charlie(NdH, 0.35) * NdL * uSheenAmt * 0.3;
      col += Lc[i] * direct * (diff * (1.0 - F) + sheenC * (spec * uSpecAmt + sh));
    } else if (uMat < 1.5) {
      // \u0431\u0430\u0440\u0445\u0430\u0442: \u0442\u0451\u043C\u043D\u0430\u044F \u043E\u0441\u043D\u043E\u0432\u0430, \u0441\u0432\u0435\u0442 \xAB\u0441\u043E\u0431\u0438\u0440\u0430\u0435\u0442\u0441\u044F\xBB \u043D\u0430 \u043A\u0440\u0430\u044F\u0445 \u0441\u043A\u043B\u0430\u0434\u043E\u043A
      vec3 diff = base * NdL / PI * 0.7;
      float sh = charlie(NdH, 0.42) * (0.7 + 0.6 * crush);
      float vis = 1.0 / (4.0 * (NdL + NdV - NdL * NdV) + 0.001);
      col += Lc[i] * direct * (diff + sheenC * sh * vis * NdL * uSheenAmt * 1.5);
    } else {
      // \u043B\u0451\u043D: \u043C\u0430\u0442\u043E\u0432\u044B\u0439, \u043F\u043E\u0447\u0442\u0438 \u0431\u0435\u0437 \u0431\u043B\u0438\u043A\u0430, \u0444\u0430\u043A\u0442\u0443\u0440\u0430 \u043D\u0438\u0442\u0435\u0439
      float rough = 0.6;
      float wrap = max((NdLr + 0.1) / 1.1, 0.0);
      // \u043F\u0440\u0438\u0431\u043B\u0438\u0436\u0435\u043D\u0438\u0435 \u041E\u0440\u0435\u043D \u2014 \u041D\u0430\u044F\u0440\u0430: \u043F\u0440\u0438 \u0441\u043A\u043E\u043B\u044C\u0437\u044F\u0449\u0435\u043C \u0432\u0437\u0433\u043B\u044F\u0434\u0435 \u0442\u043A\u0430\u043D\u044C \u0441\u0432\u0435\u0442\u043B\u0435\u0435, \u0447\u0435\u043C \u0443 \u041B\u0430\u043C\u0431\u0435\u0440\u0442\u0430
      float on = 1.0 - 0.5 * rough * rough / (rough * rough + 0.33) + 0.45 * rough * rough / (rough * rough + 0.09) * max(0.0, dot(normalize(V - Nw * NdV), normalize(L - Nw * NdLr))) * sqrt(max(0.0, 1.0 - NdV * NdV)) * 0.6;
      vec3 diff = base * wrap * on / PI;
      float a2 = uRough.x * uRough.x;
      float d = NdH * NdH * (a2 - 1.0) + 1.0;
      float spec = a2 / (PI * d * d) * schlick(max(dot(H, V), 0.0), 0.04) / (4.0 * max(NdL, 0.05) * NdV + 0.2) * NdL;
      col += Lc[i] * direct * (diff + sheenC * spec * uSpecAmt);
    }
  }
  if (uMat < 0.5) {
    // \u043E\u0442\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0441\u0442\u0443\u0434\u0438\u0439\u043D\u044B\u0445 \u0441\u043E\u0444\u0442\u0431\u043E\u043A\u0441\u043E\u0432, \u0440\u0430\u0441\u0442\u044F\u043D\u0443\u0442\u043E\u0435 \u0432\u0434\u043E\u043B\u044C \u043D\u0438\u0442\u0435\u0439 \u2014 \u0433\u043B\u0430\u0432\u043D\u044B\u0439 \u043F\u0440\u0438\u0437\u043D\u0430\u043A \u0448\u0451\u043B\u043A\u0430
    float env = 0.0;
    for (int k = -2; k <= 2; k++) {
      vec3 Rk = normalize(R + T0 * float(k) * 0.16);
      float box = smoothstep(0.35, 0.75, Rk.y) * smoothstep(0.1, -0.45, Rk.x) * smoothstep(-0.2, 0.25, Rk.z);
      float strip = smoothstep(0.55, 0.85, Rk.x) * smoothstep(0.35, 0.05, abs(Rk.y - 0.15));
      env += box * 1.0 + strip * 0.45;
    }
    env /= 5.0;
    float Fe = schlick(NdV, 0.06);
    col += sheenC * env * Fe * uSpecAmt * 2.2 * spot * mix(1.0, ao, 0.6);
  }
  // \u0440\u0430\u0441\u0441\u0435\u044F\u043D\u043D\u044B\u0439 \u0441\u0432\u0435\u0442 \u0441\u0442\u0443\u0434\u0438\u0438: \u0441\u0432\u0435\u0440\u0445\u0443 \u0441\u0432\u0435\u0442\u043B\u0435\u0435, \u0441\u043D\u0438\u0437\u0443 \u2014 \u043E\u0442\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u043E\u0442 \u0442\u0451\u043C\u043D\u043E\u0433\u043E \u043F\u043E\u043B\u0430
  float up = Nw.y * 0.5 + 0.5;
  vec3 amb = mix(shade * 0.9, mix(base, vec3(0.55, 0.66, 0.95), 0.4), up) * 0.2 * (0.35 + 0.65 * spot);
  col += amb * ao * (uMat > 0.5 && uMat < 1.5 ? 0.6 : 1.0);
  // \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0435 \u0441\u043A\u043B\u0430\u0434\u043A\u0438 \u0443\u0445\u043E\u0434\u044F\u0442 \u0432 \u0442\u043E\u043D \u0442\u0435\u043D\u0438, \u0430 \u043D\u0435 \u0432 \u0441\u0435\u0440\u043E\u0435
  col = mix(shade * 0.3, col, smoothstep(0.0, 0.85, ao) * 0.65 + 0.35);

  col = filmic(col * uExposure);
  col = toSrgb(col);
  col += (hash(gl_FragCoord.xy + uTime) - 0.5) / 255.0;

  // \u043F\u043E\u043B\u043E\u0442\u043D\u043E \u0440\u0430\u0441\u0442\u0432\u043E\u0440\u044F\u0435\u0442\u0441\u044F \u043D\u0430 \u043F\u043E\u043B\u0443, \u0431\u0435\u0437 \u0440\u0435\u0437\u043A\u0438\u0445 \u043A\u0440\u0430\u0451\u0432
  float r = length((vWorld.xz - uFade.xy) * vec2(1.0, 1.35));
  float a = uAlpha * (1.0 - smoothstep(uFade.z, uFade.w, r));
  gl_FragColor = vec4(col, a);
}`;function je(t,u,T){let c=t.createShader(u);if(t.shaderSource(c,T),t.compileShader(c),!t.getShaderParameter(c,t.COMPILE_STATUS)){let e=t.getShaderInfoLog(c);throw t.deleteShader(c),new Error(`shader: ${e}`)}return c}function de(t,u,T){let c=t.createProgram();if(t.attachShader(c,je(t,t.VERTEX_SHADER,u)),t.attachShader(c,je(t,t.FRAGMENT_SHADER,T)),t.linkProgram(c),!t.getProgramParameter(c,t.LINK_STATUS))throw new Error(`link: ${t.getProgramInfoLog(c)}`);let e={},x=t.getProgramParameter(c,t.ACTIVE_UNIFORMS);for(let d=0;d<x;d++){let Y=t.getActiveUniform(c,d),C=Y.name.replace(/\[0\]$/,"");e[C]=t.getUniformLocation(c,Y.name)}let m={},v=t.getProgramParameter(c,t.ACTIVE_ATTRIBUTES);for(let d=0;d<v;d++){let Y=t.getActiveAttrib(c,d);m[Y.name]=t.getAttribLocation(c,Y.name)}return{p:c,u:e,a:m}}function $e(t,u,T,c,e){let x=new Float32Array((u+1)*(T+1)*2),m=0;for(let C=0;C<=T;C++)for(let E=0;E<=u;E++)x[m++]=c(E/u),x[m++]=e(C/T);let v=new Uint16Array(u*T*6);m=0;for(let C=0;C<T;C++)for(let E=0;E<u;E++){let M=C*(u+1)+E,$=M+1,f=M+u+1,L=f+1;v[m++]=M,v[m++]=f,v[m++]=$,v[m++]=$,v[m++]=f,v[m++]=L}let d=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,d),t.bufferData(t.ARRAY_BUFFER,x,t.STATIC_DRAW);let Y=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,Y),t.bufferData(t.ELEMENT_ARRAY_BUFFER,v,t.STATIC_DRAW),{vb:d,ib:Y,count:v.length}}function qe(t,u,T){let c=t.createTexture();t.bindTexture(t.TEXTURE_2D,c),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,u,T,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let e=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,e),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,c,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{tex:c,fb:e,w:u,h:T}}function B(t){let u=String(t||"#000").replace("#",""),T=u.length===3?u.split("").map(e=>e+e).join(""):u,c=parseInt(T,16);return[(c>>16&255)/255,(c>>8&255)/255,(c&255)/255]}var Te={satin:{kind:0,base:"#7486C9",shade:"#0B1033",sheen:"#F4F2FF",spec:1.6,rough:[.08,.3],sheenAmt:.35,weave:.06,weaveScale:170,exposure:1},velvet:{kind:1,base:"#2B2F86",shade:"#05061A",sheen:"#C4B4FF",spec:0,rough:[.6,.6],sheenAmt:1,weave:.25,weaveScale:260,exposure:1.05},linen:{kind:2,base:"#CFCADF",shade:"#26243F",sheen:"#FFFFFF",spec:.1,rough:[.55,.55],sheenAmt:0,weave:.45,weaveScale:300,exposure:.95}};function Ke(t={}){let u=Te[t.material]?t.material:"satin",T=t.materials&&t.materials[u]||{},c={...Te[u],...T,kind:Te[u].kind};return(!Array.isArray(c.rough)||c.rough.length!==2)&&(c.rough=Te[u].rough),{material:u,mat:c,rim:t.rim||"#7AD4FF",breath:t.breath??1,ripple:t.ripple??1,tilt:t.tilt??ie.tilt,turn:t.turn??ie.turn,scale:t.scale??ie.scale,yOff:t.yOff??ie.yOff,fade:Array.isArray(t.fade)&&t.fade.length===4?t.fade:[.12,.25,.55,1.05]}}async function Qe(t,u=1){let T=await fetch(t,{credentials:"same-origin"});if(!T.ok)throw new Error(`cloth ${T.status}`);let c=await T.arrayBuffer(),e=new DataView(c);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="TMRD")throw new Error("cloth: bad file");let m=e.getUint16(6,!0),v=e.getUint16(8,!0),d=[e.getFloat32(12,!0),e.getFloat32(16,!0),e.getFloat32(20,!0)],Y=[e.getFloat32(24,!0),e.getFloat32(28,!0),e.getFloat32(32,!0)],C=e.getUint16(4,!0),E=m*v,M=36,$=new Int32Array(E*3);for(let l=0;l<E;l++){let A=l%m,s=C<2?-1:A>0?l-1:l>=m?l-m:-1;for(let V=0;V<3;V++){let O=e.getUint16(M,!0);$[l*3+V]=s<0?O:$[s*3+V]+O&65535,M+=2}}let f=new Float32Array(E*3);for(let l=0;l<E*3;l++){let A=l%3;f[l]=d[A]+$[l]/65535*(Y[A]-d[A])}let L=new Uint8Array(c,M,E),fe=new Uint8Array(c,M+E,E),we=new Uint8Array(c,M+2*E,E),Q=Math.floor((m-1)/u)+1,se=Math.floor((v-1)/u)+1,S=new Float32Array(Q*se*14),G=(l,A)=>(Math.min(v-1,Math.max(0,A))*m+Math.min(m-1,Math.max(0,l)))*3,h=0;for(let l=0;l<se;l++)for(let A=0;A<Q;A++){let s=A*u,V=l*u,O=V*m+s,te=G(s+1,V),Z=G(s-1,V),ne=G(s,V+1),ee=G(s,V-1),z=[f[te]-f[Z],f[te+1]-f[Z+1],f[te+2]-f[Z+2]],_=[f[ne]-f[ee],f[ne+1]-f[ee+1],f[ne+2]-f[ee+2]],w=[_[1]*z[2]-_[2]*z[1],_[2]*z[0]-_[0]*z[2],_[0]*z[1]-_[1]*z[0]],be=Math.hypot(w[0],w[1],w[2])||1;w=w.map(he=>he/be);let ce=Math.hypot(z[0],z[1],z[2])||1;S[h++]=f[O*3],S[h++]=f[O*3+1],S[h++]=f[O*3+2],S[h++]=w[0],S[h++]=w[1],S[h++]=w[2],S[h++]=z[0]/ce,S[h++]=z[1]/ce,S[h++]=z[2]/ce,S[h++]=s/(m-1),S[h++]=V/(v-1),S[h++]=L[O]/255,S[h++]=fe[O]/255,S[h++]=we[O]/255}let y=new Uint16Array((Q-1)*(se-1)*6);h=0;for(let l=0;l<se-1;l++)for(let A=0;A<Q-1;A++){let s=l*Q+A;y[h++]=s,y[h++]=s+Q,y[h++]=s+1,y[h++]=s+1,y[h++]=s+Q,y[h++]=s+Q+1}let U=[];for(let l=0;l<v;l+=3)for(let A=0;A<m;A+=3){let s=(l*m+A)*3;U.push(f[s],f[s+1],f[s+2])}return{data:S,index:y,pick:new Float32Array(U)}}var re=["hero","about","device","roadmap","join","footer"],Ze=Math.PI/180;function pt(t,u={},T={}){let c=!De.finePointer.matches||Math.min(innerWidth,innerHeight)<620,e=t.getContext("webgl",{alpha:!1,antialias:!0,depth:!0,stencil:!1,premultipliedAlpha:!1,powerPreference:"high-performance"})||t.getContext("experimental-webgl");if(!e)return!1;let x,m,v,d,Y=!!e.getExtension("OES_standard_derivatives");try{x=de(e,Ce,Ie),m=de(e,Ce,Oe),v=de(e,ke,Ye),d=de(e,Ge,Xe(Y))}catch(o){return console.warn(o),!1}let C=Object.assign({maxDpr:1.75,mobileMaxDpr:1.35,bgScale:.5,mobileBgScale:.34,minFps:50},u.quality),E=Object.assign({speed:.07,warp:1,grain:.03,blend:.2},u.flow),M=Object.assign({follow:.08,size:.3,intensity:.55,burst:1},u.spots),$=Object.assign({colorA:"#2A8FE0",colorB:"#A77BA5",colorC:"#1A2C66",sheen:"#E6F6FF",sheen2:"#2EE6C5",rim:"#79D3FF",speed:1,amplitude:1,opacityMobile:.72},u.silk),f=Ke(u.drape),L=re.map(o=>{let r=u.palette&&u.palette[o]||{};return{a:B(r.a||"#0B1E40"),b:B(r.b||"#102A56"),c:B(r.c||"#1D4D8F"),s1:B(r.spot1||"#009FE1"),s2:B(r.spot2||"#2EE6C5"),edge:B(r.edge||r.spot1||"#009FE1"),light:!!r.light}}),fe=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,fe),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let we=$e(e,c?150:240,c?18:28,o=>o,o=>o*2-1),Q=()=>{let o=f.mat;e.useProgram(d.p),e.uniform1f(d.u.uMat,o.kind),e.uniform3fv(d.u.uBase,B(o.base)),e.uniform3fv(d.u.uShade,B(o.shade)),e.uniform3fv(d.u.uSheen,B(o.sheen)),e.uniform3fv(d.u.uRimCol,B(f.rim)),e.uniform2f(d.u.uRough,o.rough[0],o.rough[1]),e.uniform1f(d.u.uSpecAmt,o.spec),e.uniform1f(d.u.uSheenAmt,o.sheenAmt),e.uniform1f(d.u.uWeave,o.weave),e.uniform1f(d.u.uWeaveScale,o.weaveScale),e.uniform1f(d.u.uExposure,o.exposure)};(()=>{e.useProgram(x.p);let o=r=>new Float32Array([...L.flatMap(a=>a[r]),...L[L.length-1][r]]);e.uniform3fv(x.u.uC0,o("a")),e.uniform3fv(x.u.uC1,o("b")),e.uniform3fv(x.u.uC2,o("c"));for(let[r,a,n]of[[v,$,0]])e.useProgram(r.p),e.uniform3fv(r.u.uColA,B(a.colorA)),e.uniform3fv(r.u.uColB,B(a.colorB)),e.uniform3fv(r.u.uColC,B(a.colorC)),e.uniform3fv(r.u.uSheen,B(a.sheen)),e.uniform3fv(r.u.uSheen2,B(a.sheen2)),e.uniform3fv(r.u.uRim,B(a.rim)),e.uniform1f(r.u.uMode,n),e.uniform3fv(r.u.uL1,n?[-.45,.75,.55]:[-.35,.8,.55]),e.uniform3fv(r.u.uL2,n?[.75,.55,.35]:[.7,-.35,.45]),e.uniform3fv(r.u.uSpec,n?[a.spec??.75,.32,.11]:[a.spec??.7,.3,.1])})(),Q();let S=[1,.85,.7,.58,.48],G=0,h=0,y=0,U=null;function l(){h=t.clientWidth||innerWidth,y=t.clientHeight||innerHeight;let o=c?C.mobileMaxDpr:C.maxDpr,r=Math.min(devicePixelRatio||1,o)*S[G],a=Math.max(1,Math.round(h*r)),n=Math.max(1,Math.round(y*r));(t.width!==a||t.height!==n)&&(t.width=a,t.height=n);let p=(c?C.mobileBgScale:C.bgScale)*(G>2?.8:1),g=Math.max(2,Math.round(h*p)),N=Math.max(2,Math.round(y*p));(!U||U.w!==g||U.h!==N)&&(U&&(e.deleteTexture(U.tex),e.deleteFramebuffer(U.fb)),U=qe(e,g,N)),A=!0}let A=!0;"ResizeObserver"in window?new ResizeObserver(()=>l()).observe(t):addEventListener("resize",l);let s=P.pointer,V=(o,r,a)=>{s.x=o,s.y=r,s.active=!0,s.type=a,s.t=performance.now()};addEventListener("pointermove",o=>V(o.clientX,o.clientY,o.pointerType),{passive:!0}),addEventListener("touchstart",o=>o.touches[0]&&V(o.touches[0].clientX,o.touches[0].clientY,"touch"),{passive:!0}),addEventListener("touchmove",o=>o.touches[0]&&V(o.touches[0].clientX,o.touches[0].clientY,"touch"),{passive:!0}),document.addEventListener("mouseleave",()=>s.active=!1);let O=document.querySelector("[data-stage]"),te=[],Z=0,ne=0,ee=[0,0,0],z=0,_={...ie,tilt:f.tilt,turn:f.turn,scale:f.scale,yOff:f.yOff},w={ready:!1,alpha:0,buf:null,ib:null,count:0,pick:null};function be(){let o=P.rects.stage;return o?{left:o.left,top:o.top-window.scrollY,width:o.width,height:o.height}:null}function ce(o,r){let a=be(),n=w.pick;if(!a||!n)return null;let p=a.width/a.height,g=(o-(a.left+a.width/2))/(a.width/2),N=-(r-(a.top+a.height/2))/(a.height/2),R=-1,F=1/0,H=-1,I=-1/0;for(let i=0;i<n.length;i+=3){let[b,W,ue]=He(n[i],n[i+1],n[i+2],_.tilt,_.turn,p,_),ve=(b-g)**2+(W-N)**2;ve<F&&(F=ve,R=i),ve<.0025&&ue>I&&(I=ue,H=i)}let q=H>=0?H:R;return q<0||F>.02?null:[n[q],n[q+1],n[q+2]]}function he(o,r){te.unshift({p:o,t0:D,amp:r}),te.length>4&&(te.length=4)}O&&!P.reduced&&(O.addEventListener("pointermove",o=>{let r=ce(o.clientX,o.clientY);if(!r){Z=0;return}ee=r,Z=1,o.pointerType==="mouse"&&D-z>420&&(z=D,he(r,.55*f.ripple))},{passive:!0}),O.addEventListener("pointerleave",()=>Z=0),O.addEventListener("pointerdown",o=>{let r=ce(o.clientX,o.clientY);r&&(ee=r,Z=1,he(r,1*f.ripple),o.pointerType!=="mouse"&&setTimeout(()=>Z=0,900))},{passive:!0}));let Je=[["aPos",3,0],["aNrm",3,12],["aTan",3,24],["aUV",2,36],["aAttr",3,44]];T.drapeUrl&&Qe(T.drapeUrl,1).then(o=>{w.buf=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,w.buf),e.bufferData(e.ARRAY_BUFFER,o.data,e.STATIC_DRAW),w.ib=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,w.ib),e.bufferData(e.ELEMENT_ARRAY_BUFFER,o.index,e.STATIC_DRAW),w.count=o.index.length,w.pick=o.pick,w.ready=!0,A=!0,me(),T.onCloth&&T.onCloth()}).catch(o=>console.warn("cloth",o));let Ee=Array.from({length:8},()=>({x:.5,y:.5,r:.2,a:0,c:[0,0,0]})),J=[{x:.7,y:.35},{x:.62,y:.45}],oe=[];function Ue(o,r,a,n=3,p=1){for(let g=0;g<n;g++)oe.push({x:K(o+(Math.random()-.5)*.5*p,.02,.98),y:K(r+(Math.random()-.5)*.18*p,-.1,1.1),r0:.05,r1:(.22+Math.random()*.18)*M.size*3*p,t0:D+g*90,dur:1500+Math.random()*700,c:a[g%a.length]});for(;oe.length>6;)oe.shift()}addEventListener("tmr:burst",o=>{let r=o.detail||{},a=(r.x??h/2)/h,n=(r.y??y/2)/y,p=ye(n);Ue(a,n,[L[p].s1,L[p].s2,B("#FFFFFF")],4,.8),A=!0});let k=[];function _e(){k=re.map(o=>P.sections.find(r=>r.id===o)).filter(Boolean)}P.events.addEventListener("measure",()=>{_e(),A=!0}),_e();function ye(o){let r=window.scrollY+o*y;for(let a=0;a<k.length;a++){let n=k[a];if(r<n.top+n.height)return re.indexOf(n.id)}return re.length-1}function et(o,r){let a=o*y,n=E.blend*y,p=L[re.indexOf(k[0]?k[0].id:"hero")][r];for(let g=0;g<k.length-1;g++){let N=k[g],R=N.top+N.height-window.scrollY,F=K((a-(R-n))/(2*n)),H=F*F*(3-2*F),I=L[re.indexOf(k[g+1].id)][r];p=p.map((q,i)=>j(q,I[i],H))}return p}let Re=-1,X=0,D=performance.now(),tt=D,ae=12,le=16.7,pe=0,xe=0,Fe=0,Pe=!1,Ne=D,Se=0,Me=window.scrollY,Le=.3;function Ve(){let o=window.scrollY,r=o-Me;Me=o,Se=j(Se,K(Math.abs(r)/45),.08),e.bindFramebuffer(e.FRAMEBUFFER,U.fb),e.viewport(0,0,U.w,U.h),e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.useProgram(x.p),e.uniform2f(x.u.uRes,U.w,U.h),e.uniform1f(x.u.uTime,ae*E.speed),e.uniform1f(x.u.uWarp,E.warp),e.uniform1f(x.u.uBlend,E.blend);let a=new Float32Array(6),n=k.map(i=>re.indexOf(i.id));for(let i=0;i<k.length-1&&i<6;i++){let b=k[i];a[i]=(b.top+b.height-o)/y}e.uniform1fv(x.u.uB,a),e.uniform1i(x.u.uN,Math.max(1,k.length)),n.join()!==Ae.last&&Ae(n);let p=!s.active||D-s.t>6e3,g=p?.5+.32*Math.sin(ae*.13):s.x/h,N=p?.42+.22*Math.sin(ae*.17+1.2):s.y/y,R=P.reduced?1:M.follow;J[0].x=j(J[0].x,g+.04,R),J[0].y=j(J[0].y,N-.05,R),J[1].x=j(J[1].x,g-.06,R*.45),J[1].y=j(J[1].y,N+.07,R*.45);let F=ye(.5),H=L[F]&&L[F].light;for(let i=0;i<2;i++){let b=Ee[i];b.x=J[i].x,b.y=J[i].y,b.r=M.size*(i?.72:1);let W=L[ye(K(b.y,0,1))].light;b.a=M.intensity*(W?.45:1)*(i?.8:1),b.c=et(b.y,i?"s2":"s1")}if(F!==Re){if(Re!==-1&&!P.reduced){let i=k.find(W=>re.indexOf(W.id)===F),b=i?K((i.top-o)/y,.05,.95):.5;Ue(.5,b,[L[F].s1,L[F].s2],3,1.2*M.burst)}Re=F}for(let i=0;i<6;i++){let b=Ee[i+2],W=oe[i];if(!W){b.a=0;continue}let ue=(D-W.t0)/W.dur;if(ue<0){b.a=0;continue}let ve=1-Math.pow(1-K(ue),3);b.x=W.x,b.y=W.y,b.r=j(W.r0,W.r1,ve),b.a=Math.pow(K(1-ue),2)*.85,b.c=W.c}for(let i=oe.length-1;i>=0;i--)D-oe[i].t0>oe[i].dur&&oe.splice(i,1);let I=new Float32Array(32),q=new Float32Array(24);Ee.forEach((i,b)=>{I.set([i.x,i.y,i.r,i.a],b*4),q.set(i.c,b*3)}),e.uniform4fv(x.u.uSpot,I),e.uniform3fv(x.u.uSpotC,q),e.bindBuffer(e.ARRAY_BUFFER,fe),e.enableVertexAttribArray(x.a.aPos),e.vertexAttribPointer(x.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t.width,t.height),e.useProgram(m.p),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,U.tex),e.uniform1i(m.u.uTex,0),e.uniform1f(m.u.uTime,ae),e.uniform1f(m.u.uGrain,E.grain*(H?.6:1)),Le=j(Le,H?0:.34,.08),e.uniform1f(m.u.uVignette,Le),e.bindBuffer(e.ARRAY_BUFFER,fe),e.enableVertexAttribArray(m.a.aPos),e.vertexAttribPointer(m.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.DEPTH_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),ot(o),rt(o),e.disableVertexAttribArray(0)}function Ae(o){Ae.last=o.join(),e.useProgram(x.p);let r=o.length?o:[0],a=p=>{let g=[];for(let N=0;N<7;N++)g.push(...L[r[Math.min(N,r.length-1)]][p]);return new Float32Array(g)};e.uniform3fv(x.u.uC0,a("a")),e.uniform3fv(x.u.uC1,a("b")),e.uniform3fv(x.u.uC2,a("c"));let n=[];for(let p=0;p<6;p++)n.push(...L[r[Math.min(p+1,r.length-1)]].edge);e.uniform3fv(x.u.uEdge,new Float32Array(n)),e.uniform1f(x.u.uEdgeAmt,E.edge??.5)}Ae.last="";function ze(o,r){let a=(r.left+r.width/2)/h*2-1,n=1-(r.top+r.height/2)/y*2;e.uniform4f(o.u.uRect,a,n,r.width/h,r.height/y),e.uniform1f(o.u.uAspect,r.width/r.height)}let Be=0;function ot(o){let r=P.rects.hero;if(!r)return;let a=Math.min(r.height,y*1.02),n={left:r.left,top:r.top-o,width:r.width,height:a};if(n.top+n.height<-40||n.top>y)return;let p=n.width/n.height,g=1/p,N=p<1;e.useProgram(v.p),ze(v,n),e.uniform1f(v.u.uCam,3.4),e.uniform1f(v.u.uTime,ae*$.speed),e.uniform1f(v.u.uAmp,(N?.34:.3)*$.amplitude);let R=K(-n.top/(n.height*.9));e.uniform1f(v.u.uLift,R),e.uniform1f(v.u.uWidth,N?.34:.21),N?(e.uniform2f(v.u.uPath0,-1.4,-g*.62),e.uniform2f(v.u.uPath1,1.4,-g*.02)):(e.uniform2f(v.u.uPath0,-1.3,-g*1.05),e.uniform2f(v.u.uPath1,1.3,g*.5));let F=s.active&&s.y>n.top&&s.y<n.top+n.height;Be=j(Be,F&&!P.reduced?1:0,.06);let H=(s.x-(n.left+n.width/2))/(n.width/2),I=-(s.y-(n.top+n.height/2))/(n.width/2);e.uniform3f(v.u.uPtr,H,I,Be);let q=(c?$.opacityMobile:.96)*(1-K((R-.35)/.65));e.uniform1f(v.u.uAlpha,q),nt(v,we)}function rt(o){let r=P.rects.stage;if(!r||!w.ready)return;let a={left:r.left,top:r.top-o,width:r.width,height:r.height};if(a.top+a.height<-60||a.top>y+60)return;w.alpha=P.reduced?1:Math.min(1,w.alpha+.04);let n=d.u;e.useProgram(d.p),ze(d,a),e.uniform1f(n.uCam,_.cam),e.uniform1f(n.uTime,ae),e.uniform1f(n.uBreath,P.reduced?0:f.breath),e.uniform1f(n.uGust,P.reduced?0:Se),ne=j(ne,Z,.07),e.uniform1f(n.uHoverAmp,ne),e.uniform3f(n.uHover,ee[0],ee[1],ee[2]);let p=new Float32Array(16),g=new Float32Array(4);te.forEach((R,F)=>{let H=(D-R.t0)/1e3;p.set([R.p[0],R.p[1],R.p[2],H<4?R.amp:0],F*4),g[F]=H}),e.uniform4fv(n.uRip,p),e.uniform1fv(n.uRipAge,g),e.uniform2f(n.uTilt,_.tilt*Ze,_.turn*Ze),e.uniform3f(n.uCenter,_.center[0],0,_.center[2]),e.uniform1f(n.uScale,_.scale),e.uniform1f(n.uYOff,_.yOff),e.uniform4f(n.uFade,f.fade[0],f.fade[1],f.fade[2],f.fade[3]),e.uniform1f(n.uAlpha,w.alpha),e.bindBuffer(e.ARRAY_BUFFER,w.buf);let N=[];for(let[R,F,H]of Je){let I=d.a[R];I===void 0||I<0||(e.enableVertexAttribArray(I),e.vertexAttribPointer(I,F,e.FLOAT,!1,56,H),N.push(I))}e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,w.ib),e.drawElements(e.TRIANGLES,w.count,e.UNSIGNED_SHORT,0),N.forEach(R=>e.disableVertexAttribArray(R)),w.alpha<1&&(A=!0)}function nt(o,r){e.bindBuffer(e.ARRAY_BUFFER,r.vb),e.enableVertexAttribArray(o.a.aUV),e.vertexAttribPointer(o.a.aUV,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.ib),e.drawElements(e.TRIANGLES,r.count,e.UNSIGNED_SHORT,0)}function at(o){X=0,D=o||performance.now();let r=Math.min(100,D-Ne);Ne=D,P.reduced||(ae+=r/1e3),U||l(),Ve(),it(r),A=!1,me()}function me(){X||Pe||document.hidden||P.reduced&&!A||(X=requestAnimationFrame(at))}function it(o){if(P.reduced||o<=0)return;le=j(le,o,.05);let r=1e3/(C.minFps-2);if(le>r?(pe+=o,xe=0):le<1e3/58&&(xe+=o,pe=0),G===S.length-1&&le>1e3/18?Fe+=o:Fe=0,Fe>2500&&!window.__TMR_KEEP_GL){Pe=!0,X&&cancelAnimationFrame(X),X=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl");return}pe>1500&&G<S.length-1?(G++,pe=0,l()):xe>8e3&&G>0&&(G--,xe=0,l())}return document.addEventListener("visibilitychange",()=>{document.hidden?X&&(cancelAnimationFrame(X),X=0):(Ne=performance.now(),me())}),addEventListener("scroll",()=>{A=!0,me()},{passive:!0}),t.addEventListener("webglcontextlost",o=>{o.preventDefault(),X&&cancelAnimationFrame(X),X=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl")}),l(),D=performance.now(),tt=D,Ve(),me(),T.invalidate&&T.invalidate(),!0}export{pt as startScene};
