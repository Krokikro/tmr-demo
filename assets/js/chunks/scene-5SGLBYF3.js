import{a as fe,b as Xe}from"./chunk-NVNCX4J7.js";import{b as Ge,c as V,f as Z,g as $}from"./chunk-MBL2NX2W.js";var ye=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`,Pe=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,je=`${ye}
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
}`,$e=`${ye}
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
}`,qe=`
uniform vec4 uRect;   // \u0446\u0435\u043D\u0442\u0440 \u0438 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430 \u0432 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u0445 \u044D\u043A\u0440\u0430\u043D\u0430 (-1..1)
uniform float uAspect; // \u0448\u0438\u0440\u0438\u043D\u0430 / \u0432\u044B\u0441\u043E\u0442\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430
uniform float uCam;
vec4 project(vec3 p) {
  float k = uCam / (uCam - p.z);
  vec2 sp = p.xy * k;
  vec2 ndc = uRect.xy + vec2(sp.x, sp.y * uAspect) * uRect.zw;
  return vec4(ndc, clamp(-p.z * 0.15, -0.99, 0.99), 1.0);
}`,Ke=`
attribute vec2 aUV;
uniform float uTime;
uniform float uAmp;
uniform float uLift;
uniform float uWidth;
uniform vec2 uPath0;
uniform vec2 uPath1;
uniform vec3 uPtr;
${qe}
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
}`,Qe=`${ye}
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
}`,Ze=`
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
${qe}
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
}`,Je=t=>`${t?`#extension GL_OES_standard_derivatives : enable
`:""}${ye}
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
}`;function et(t,f,g){let i=t.createShader(f);if(t.shaderSource(i,g),t.compileShader(i),!t.getShaderParameter(i,t.COMPILE_STATUS)){let e=t.getShaderInfoLog(i);throw t.deleteShader(i),new Error(`shader: ${e}`)}return i}function xe(t,f,g){let i=t.createProgram();if(t.attachShader(i,et(t,t.VERTEX_SHADER,f)),t.attachShader(i,et(t,t.FRAGMENT_SHADER,g)),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw new Error(`link: ${t.getProgramInfoLog(i)}`);let e={},h=t.getProgramParameter(i,t.ACTIVE_UNIFORMS);for(let v=0;v<h;v++){let Y=t.getActiveUniform(i,v),C=Y.name.replace(/\[0\]$/,"");e[C]=t.getUniformLocation(i,Y.name)}let l={},m=t.getProgramParameter(i,t.ACTIVE_ATTRIBUTES);for(let v=0;v<m;v++){let Y=t.getActiveAttrib(i,v);l[Y.name]=t.getAttribLocation(i,Y.name)}return{p:i,u:e,a:l}}function tt(t,f,g,i,e){let h=new Float32Array((f+1)*(g+1)*2),l=0;for(let C=0;C<=g;C++)for(let T=0;T<=f;T++)h[l++]=i(T/f),h[l++]=e(C/g);let m=new Uint16Array(f*g*6);l=0;for(let C=0;C<g;C++)for(let T=0;T<f;T++){let D=C*(f+1)+T,q=D+1,s=D+f+1,U=s+1;m[l++]=D,m[l++]=s,m[l++]=q,m[l++]=q,m[l++]=s,m[l++]=U}let v=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,v),t.bufferData(t.ARRAY_BUFFER,h,t.STATIC_DRAW);let Y=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,Y),t.bufferData(t.ELEMENT_ARRAY_BUFFER,m,t.STATIC_DRAW),{vb:v,ib:Y,count:m.length}}function ot(t,f,g){let i=t.createTexture();t.bindTexture(t.TEXTURE_2D,i),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,f,g,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE);let e=t.createFramebuffer();return t.bindFramebuffer(t.FRAMEBUFFER,e),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,i,0),t.bindFramebuffer(t.FRAMEBUFFER,null),{tex:i,fb:e,w:f,h:g}}function M(t){let f=String(t||"#000").replace("#",""),g=f.length===3?f.split("").map(e=>e+e).join(""):f,i=parseInt(g,16);return[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255]}var Re={satin:{kind:0,base:"#7486C9",shade:"#0B1033",sheen:"#F4F2FF",spec:1.6,rough:[.08,.3],sheenAmt:.35,weave:.06,weaveScale:170,exposure:1},velvet:{kind:1,base:"#2B2F86",shade:"#05061A",sheen:"#C4B4FF",spec:0,rough:[.6,.6],sheenAmt:1,weave:.25,weaveScale:260,exposure:1.05},linen:{kind:2,base:"#CFCADF",shade:"#26243F",sheen:"#FFFFFF",spec:.1,rough:[.55,.55],sheenAmt:0,weave:.45,weaveScale:300,exposure:.95}};function rt(t={}){let f=Re[t.material]?t.material:"satin",g=t.materials&&t.materials[f]||{},i={...Re[f],...g,kind:Re[f].kind};return(!Array.isArray(i.rough)||i.rough.length!==2)&&(i.rough=Re[f].rough),{material:f,mat:i,rim:t.rim||"#7AD4FF",breath:t.breath??1,ripple:t.ripple??1,tilt:t.tilt??fe.tilt,turn:t.turn??fe.turn,scale:t.scale??fe.scale,yOff:t.yOff??fe.yOff,fade:Array.isArray(t.fade)&&t.fade.length===4?t.fade:[.12,.25,.55,1.05]}}async function nt(t,f=1){let g=await fetch(t,{credentials:"same-origin"});if(!g.ok)throw new Error(`cloth ${g.status}`);let i=await g.arrayBuffer(),e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="TMRD")throw new Error("cloth: bad file");let l=e.getUint16(6,!0),m=e.getUint16(8,!0),v=[e.getFloat32(12,!0),e.getFloat32(16,!0),e.getFloat32(20,!0)],Y=[e.getFloat32(24,!0),e.getFloat32(28,!0),e.getFloat32(32,!0)],C=e.getUint16(4,!0),T=l*m,D=36,q=new Int32Array(T*3);for(let u=0;u<T;u++){let b=u%l,d=C<2?-1:b>0?u-1:u>=l?u-l:-1;for(let N=0;N<3;N++){let X=e.getUint16(D,!0);q[u*3+N]=d<0?X:q[d*3+N]+X&65535,D+=2}}let s=new Float32Array(T*3);for(let u=0;u<T*3;u++){let b=u%3;s[u]=v[b]+q[u]/65535*(Y[b]-v[b])}let U=new Uint8Array(i,D,T),se=new Uint8Array(i,D+T,T),Ae=new Uint8Array(i,D+2*T,T),K=Math.floor((l-1)/f)+1,ie=Math.floor((m-1)/f)+1,_=new Float32Array(K*ie*14),te=(u,b)=>(Math.min(m-1,Math.max(0,b))*l+Math.min(l-1,Math.max(0,u)))*3,x=0;for(let u=0;u<ie;u++)for(let b=0;b<K;b++){let d=b*f,N=u*f,X=N*l+d,S=te(d+1,N),le=te(d-1,N),oe=te(d,N+1),re=te(d,N-1),L=[s[S]-s[le],s[S+1]-s[le+1],s[S+2]-s[le+2]],J=[s[oe]-s[re],s[oe+1]-s[re+1],s[oe+2]-s[re+2]],O=[J[1]*L[2]-J[2]*L[1],J[2]*L[0]-J[0]*L[2],J[0]*L[1]-J[1]*L[0]],ge=Math.hypot(O[0],O[1],O[2])||1;O=O.map(B=>B/ge);let W=Math.hypot(L[0],L[1],L[2])||1;_[x++]=s[X*3],_[x++]=s[X*3+1],_[x++]=s[X*3+2],_[x++]=O[0],_[x++]=O[1],_[x++]=O[2],_[x++]=L[0]/W,_[x++]=L[1]/W,_[x++]=L[2]/W,_[x++]=d/(l-1),_[x++]=N/(m-1),_[x++]=U[X]/255,_[x++]=se[X]/255,_[x++]=Ae[X]/255}let z=new Uint16Array((K-1)*(ie-1)*6);x=0;for(let u=0;u<ie-1;u++)for(let b=0;b<K-1;b++){let d=u*K+b;z[x++]=d,z[x++]=d+K,z[x++]=d+1,z[x++]=d+1,z[x++]=d+K,z[x++]=d+K+1}let F=[];for(let u=0;u<m;u+=3)for(let b=0;b<l;b+=3){let d=(u*l+b)*3;F.push(s[d],s[d+1],s[d+2])}return{data:_,index:z,pick:new Float32Array(F)}}var ae=["hero","about","device","roadmap","join","footer"],at=Math.PI/180;function yt(t,f={},g={}){let i=!Ge.finePointer.matches||Math.min(innerWidth,innerHeight)<620,e=t.getContext("webgl",{alpha:!1,antialias:!0,depth:!0,stencil:!1,premultipliedAlpha:!1,powerPreference:"high-performance"})||t.getContext("experimental-webgl");if(!e)return!1;let h,l,m,v;function Y(){let o=!!e.getExtension("OES_standard_derivatives");h=xe(e,Pe,je),l=xe(e,Pe,$e),m=xe(e,Ke,Qe),v=xe(e,Ze,Je(o))}try{Y()}catch(o){return console.warn(o),!1}let C=Object.assign({maxDpr:1.75,mobileMaxDpr:1.35,bgScale:.5,mobileBgScale:.34,minFps:50,mobileMinFps:40},f.quality),T=Object.assign({speed:.07,warp:1,grain:.03,blend:.2},f.flow),D=Object.assign({follow:.08,size:.3,intensity:.55,burst:1},f.spots),q=Object.assign({colorA:"#2A8FE0",colorB:"#A77BA5",colorC:"#1A2C66",sheen:"#E6F6FF",sheen2:"#2EE6C5",rim:"#79D3FF",speed:1,amplitude:1,opacityMobile:.72},f.silk),s=rt(f.drape),U=ae.map(o=>{let r=f.palette&&f.palette[o]||{};return{a:M(r.a||"#0B1E40"),b:M(r.b||"#102A56"),c:M(r.c||"#1D4D8F"),s1:M(r.spot1||"#009FE1"),s2:M(r.spot2||"#2EE6C5"),edge:M(r.edge||r.spot1||"#009FE1"),light:!!r.light}}),se,Ae;function K(){se=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,se),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW),Ae=tt(e,i?150:240,i?18:28,o=>o,o=>o*2-1)}K();let ie=()=>{let o=s.mat;e.useProgram(v.p),e.uniform1f(v.u.uMat,o.kind),e.uniform3fv(v.u.uBase,M(o.base)),e.uniform3fv(v.u.uShade,M(o.shade)),e.uniform3fv(v.u.uSheen,M(o.sheen)),e.uniform3fv(v.u.uRimCol,M(s.rim)),e.uniform2f(v.u.uRough,o.rough[0],o.rough[1]),e.uniform1f(v.u.uSpecAmt,o.spec),e.uniform1f(v.u.uSheenAmt,o.sheenAmt),e.uniform1f(v.u.uWeave,o.weave),e.uniform1f(v.u.uWeaveScale,o.weaveScale),e.uniform1f(v.u.uExposure,o.exposure)},_=()=>{e.useProgram(h.p);let o=r=>new Float32Array([...U.flatMap(a=>a[r]),...U[U.length-1][r]]);e.uniform3fv(h.u.uC0,o("a")),e.uniform3fv(h.u.uC1,o("b")),e.uniform3fv(h.u.uC2,o("c"));for(let[r,a,n]of[[m,q,0]])e.useProgram(r.p),e.uniform3fv(r.u.uColA,M(a.colorA)),e.uniform3fv(r.u.uColB,M(a.colorB)),e.uniform3fv(r.u.uColC,M(a.colorC)),e.uniform3fv(r.u.uSheen,M(a.sheen)),e.uniform3fv(r.u.uSheen2,M(a.sheen2)),e.uniform3fv(r.u.uRim,M(a.rim)),e.uniform1f(r.u.uMode,n),e.uniform3fv(r.u.uL1,n?[-.45,.75,.55]:[-.35,.8,.55]),e.uniform3fv(r.u.uL2,n?[.75,.55,.35]:[.7,-.35,.45]),e.uniform3fv(r.u.uSpec,n?[a.spec??.75,.32,.11]:[a.spec??.7,.3,.1])};_(),ie();let te=[1,.85,.7,.58,.48],x=0,z=0,F=0,u=null;function b(){z=t.clientWidth||innerWidth,F=t.clientHeight||innerHeight;let o=i?C.mobileMaxDpr:C.maxDpr,r=Math.min(devicePixelRatio||1,o)*te[x],a=Math.max(1,Math.round(z*r)),n=Math.max(1,Math.round(F*r));(t.width!==a||t.height!==n)&&(t.width=a,t.height=n);let p=(i?C.mobileBgScale:C.bgScale)*(x>2?.8:1),A=Math.max(2,Math.round(z*p)),R=Math.max(2,Math.round(F*p));(!u||u.w!==A||u.h!==R)&&(u&&(e.deleteTexture(u.tex),e.deleteFramebuffer(u.fb)),u=ot(e,A,R)),d=!0}let d=!0,N=!0,X=()=>{N=!0,d=!0,ue()};"ResizeObserver"in window?new ResizeObserver(X).observe(t):addEventListener("resize",X);let S=V.pointer,le=(o,r,a)=>{S.x=o,S.y=r,S.active=!0,S.type=a,S.t=performance.now()};addEventListener("pointermove",o=>o.pointerType==="mouse"&&le(o.clientX,o.clientY,"mouse"),{passive:!0}),addEventListener("pointerdown",o=>o.pointerType!=="mouse"&&le(o.clientX,o.clientY,o.pointerType),{passive:!0}),document.addEventListener("mouseleave",()=>S.active=!1);let oe=document.querySelector("[data-stage]"),re=[],L=0,J=0,O=[0,0,0],ge=0,W={...fe,tilt:s.tilt,turn:s.turn,scale:s.scale,yOff:s.yOff},B={ready:!1,alpha:0,buf:null,ib:null,count:0,pick:null};function it(){let o=V.rects.stage;return o?{left:o.left,top:o.top-window.scrollY,width:o.width,height:o.height}:null}function Me(o,r){let a=it(),n=B.pick;if(!a||!n)return null;let p=a.width/a.height,A=(o-(a.left+a.width/2))/(a.width/2),R=-(r-(a.top+a.height/2))/(a.height/2),E=-1,y=1/0,I=-1,H=-1/0;for(let c=0;c<n.length;c+=3){let[w,k,ve]=Xe(n[c],n[c+1],n[c+2],W.tilt,W.turn,p,W),he=(w-A)**2+(k-R)**2;he<y&&(y=he,E=c),he<.0025&&ve>H&&(H=ve,I=c)}let Q=I>=0?I:E;return Q<0||y>.02?null:[n[Q],n[Q+1],n[Q+2]]}function Ve(o,r){re.unshift({p:o,t0:P,amp:r}),re.length>4&&(re.length=4)}oe&&!V.reduced&&(oe.addEventListener("pointermove",o=>{let r=Me(o.clientX,o.clientY);if(!r){L=0;return}O=r,L=1,o.pointerType==="mouse"&&P-ge>420&&(ge=P,Ve(r,.55*s.ripple))},{passive:!0}),oe.addEventListener("pointerleave",()=>L=0),oe.addEventListener("pointerdown",o=>{let r=Me(o.clientX,o.clientY);r&&(O=r,L=1,Ve(r,1*s.ripple),o.pointerType!=="mouse"&&setTimeout(()=>L=0,900))},{passive:!0}));let ct=[["aPos",3,0],["aNrm",3,12],["aTan",3,24],["aUV",2,36],["aAttr",3,44]],me=null;function ze(){me&&(B.buf=e.createBuffer(),e.bindBuffer(e.ARRAY_BUFFER,B.buf),e.bufferData(e.ARRAY_BUFFER,me.data,e.STATIC_DRAW),B.ib=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,B.ib),e.bufferData(e.ELEMENT_ARRAY_BUFFER,me.index,e.STATIC_DRAW),B.count=me.index.length,B.pick=me.pick,B.ready=!0)}g.drapeUrl&&nt(g.drapeUrl,1).then(o=>{me=o,be||ze(),d=!0,ue(),g.onCloth&&g.onCloth()}).catch(o=>console.warn("cloth",o));let Fe=Array.from({length:8},()=>({x:.5,y:.5,r:.2,a:0,c:[0,0,0]})),ee=[{x:.7,y:.35},{x:.62,y:.45}],ne=[];function De(o,r,a,n=3,p=1){for(let A=0;A<n;A++)ne.push({x:Z(o+(Math.random()-.5)*.5*p,.02,.98),y:Z(r+(Math.random()-.5)*.18*p,-.1,1.1),r0:.05,r1:(.22+Math.random()*.18)*D.size*3*p,t0:P+A*90,dur:1500+Math.random()*700,c:a[A%a.length]});for(;ne.length>6;)ne.shift()}addEventListener("tmr:burst",o=>{let r=o.detail||{},a=(r.x??z/2)/z,n=(r.y??F/2)/F,p=Ne(n);De(a,n,[U[p].s1,U[p].s2,M("#FFFFFF")],4,.8),d=!0});let G=[];function Ie(){G=ae.map(o=>V.sections.find(r=>r.id===o)).filter(Boolean)}V.events.addEventListener("measure",()=>{Ie(),d=!0}),Ie();function Ne(o){let r=window.scrollY+o*F;for(let a=0;a<G.length;a++){let n=G[a];if(r<n.top+n.height)return ae.indexOf(n.id)}return ae.length-1}function ut(o,r){let a=o*F,n=T.blend*F,p=U[ae.indexOf(G[0]?G[0].id:"hero")][r];for(let A=0;A<G.length-1;A++){let R=G[A],E=R.top+R.height-window.scrollY,y=Z((a-(E-n))/(2*n)),I=y*y*(3-2*y),H=U[ae.indexOf(G[A+1].id)][r];p=p.map((Q,c)=>$(Q,H[c],I))}return p}let Se=-1,He=-1e9,j=0,P=performance.now(),ft=P,ce=12,de=16.7,we=0,Te=0,Le=0,Be=!1,be=!1,Oe=0,Ee=P,Ce=0,We=window.scrollY,Ue=.3;function ke(){let o=window.scrollY,r=o-We;We=o,Ce=$(Ce,Z(Math.abs(r)/45),.08),e.bindFramebuffer(e.FRAMEBUFFER,u.fb),e.viewport(0,0,u.w,u.h),e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.useProgram(h.p),e.uniform2f(h.u.uRes,u.w,u.h),e.uniform1f(h.u.uTime,ce*T.speed),e.uniform1f(h.u.uWarp,T.warp),e.uniform1f(h.u.uBlend,T.blend);let a=new Float32Array(6),n=G.map(c=>ae.indexOf(c.id));for(let c=0;c<G.length-1&&c<6;c++){let w=G[c];a[c]=(w.top+w.height-o)/F}e.uniform1fv(h.u.uB,a),e.uniform1i(h.u.uN,Math.max(1,G.length)),n.join()!==pe.last&&pe(n);let p=!S.active||P-S.t>6e3,A=p?.5+.32*Math.sin(ce*.13):S.x/z,R=p?.42+.22*Math.sin(ce*.17+1.2):S.y/F,E=V.reduced?1:D.follow;ee[0].x=$(ee[0].x,A+.04,E),ee[0].y=$(ee[0].y,R-.05,E),ee[1].x=$(ee[1].x,A-.06,E*.45),ee[1].y=$(ee[1].y,R+.07,E*.45);let y=Ne(.5),I=U[y]&&U[y].light;for(let c=0;c<2;c++){let w=Fe[c];w.x=ee[c].x,w.y=ee[c].y,w.r=D.size*(c?.72:1);let k=U[Ne(Z(w.y,0,1))].light;w.a=D.intensity*(k?.45:1)*(c?.8:1),w.c=ut(w.y,c?"s2":"s1")}if(y!==Se){if(Se!==-1&&!V.reduced&&P-He>1400){He=P;let c=G.find(k=>ae.indexOf(k.id)===y),w=c?Z((c.top-o)/F,.05,.95):.5;De(.5,w,[U[y].s1,U[y].s2],i?2:3,(i?.9:1.2)*D.burst)}Se=y}for(let c=0;c<6;c++){let w=Fe[c+2],k=ne[c];if(!k){w.a=0;continue}let ve=(P-k.t0)/k.dur;if(ve<0){w.a=0;continue}let he=1-Math.pow(1-Z(ve),3);w.x=k.x,w.y=k.y,w.r=$(k.r0,k.r1,he),w.a=Math.pow(Z(1-ve),2)*(i?.6:.85),w.c=k.c}for(let c=ne.length-1;c>=0;c--)P-ne[c].t0>ne[c].dur&&ne.splice(c,1);let H=new Float32Array(32),Q=new Float32Array(24);Fe.forEach((c,w)=>{H.set([c.x,c.y,c.r,c.a],w*4),Q.set(c.c,w*3)}),e.uniform4fv(h.u.uSpot,H),e.uniform3fv(h.u.uSpotC,Q),e.bindBuffer(e.ARRAY_BUFFER,se),e.enableVertexAttribArray(h.a.aPos),e.vertexAttribPointer(h.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,t.width,t.height),e.useProgram(l.p),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,u.tex),e.uniform1i(l.u.uTex,0),e.uniform1f(l.u.uTime,ce),e.uniform1f(l.u.uGrain,T.grain*(I?.6:1)),Ue=$(Ue,I?0:.34,.08),e.uniform1f(l.u.uVignette,Ue),e.bindBuffer(e.ARRAY_BUFFER,se),e.enableVertexAttribArray(l.a.aPos),e.vertexAttribPointer(l.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.DEPTH_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),st(o),lt(o),e.disableVertexAttribArray(0)}function pe(o){pe.last=o.join(),e.useProgram(h.p);let r=o.length?o:[0],a=p=>{let A=[];for(let R=0;R<7;R++)A.push(...U[r[Math.min(R,r.length-1)]][p]);return new Float32Array(A)};e.uniform3fv(h.u.uC0,a("a")),e.uniform3fv(h.u.uC1,a("b")),e.uniform3fv(h.u.uC2,a("c"));let n=[];for(let p=0;p<6;p++)n.push(...U[r[Math.min(p+1,r.length-1)]].edge);e.uniform3fv(h.u.uEdge,new Float32Array(n)),e.uniform1f(h.u.uEdgeAmt,T.edge??.5)}pe.last="";function Ye(o,r){let a=(r.left+r.width/2)/z*2-1,n=1-(r.top+r.height/2)/F*2;e.uniform4f(o.u.uRect,a,n,r.width/z,r.height/F),e.uniform1f(o.u.uAspect,r.width/r.height)}let _e=0;function st(o){let r=V.rects.hero;if(!r)return;let a=Math.min(r.height,F*1.02),n={left:r.left,top:r.top-o,width:r.width,height:a};if(n.top+n.height<-40||n.top>F)return;let p=n.width/n.height,A=1/p,R=p<1;e.useProgram(m.p),Ye(m,n),e.uniform1f(m.u.uCam,3.4),e.uniform1f(m.u.uTime,ce*q.speed),e.uniform1f(m.u.uAmp,(R?.34:.3)*q.amplitude);let E=Z(-n.top/(n.height*.9));e.uniform1f(m.u.uLift,E),e.uniform1f(m.u.uWidth,R?.34:.21),R?(e.uniform2f(m.u.uPath0,-1.4,-A*.62),e.uniform2f(m.u.uPath1,1.4,-A*.02)):(e.uniform2f(m.u.uPath0,-1.3,-A*1.05),e.uniform2f(m.u.uPath1,1.3,A*.5));let y=S.active&&S.y>n.top&&S.y<n.top+n.height;_e=$(_e,y&&!V.reduced?1:0,.06);let I=(S.x-(n.left+n.width/2))/(n.width/2),H=-(S.y-(n.top+n.height/2))/(n.width/2);e.uniform3f(m.u.uPtr,I,H,_e);let Q=(i?q.opacityMobile:.96)*(1-Z((E-.35)/.65));e.uniform1f(m.u.uAlpha,Q),mt(m,Ae)}function lt(o){let r=V.rects.stage;if(!r||!B.ready)return;let a={left:r.left,top:r.top-o,width:r.width,height:r.height};if(a.top+a.height<-60||a.top>F+60)return;B.alpha=V.reduced?1:Math.min(1,B.alpha+.04);let n=v.u;e.useProgram(v.p),Ye(v,a),e.uniform1f(n.uCam,W.cam),e.uniform1f(n.uTime,ce),e.uniform1f(n.uBreath,V.reduced?0:s.breath),e.uniform1f(n.uGust,V.reduced?0:Ce),J=$(J,L,.07),e.uniform1f(n.uHoverAmp,J),e.uniform3f(n.uHover,O[0],O[1],O[2]);let p=new Float32Array(16),A=new Float32Array(4);re.forEach((E,y)=>{let I=(P-E.t0)/1e3;p.set([E.p[0],E.p[1],E.p[2],I<4?E.amp:0],y*4),A[y]=I}),e.uniform4fv(n.uRip,p),e.uniform1fv(n.uRipAge,A),e.uniform2f(n.uTilt,W.tilt*at,W.turn*at),e.uniform3f(n.uCenter,W.center[0],0,W.center[2]),e.uniform1f(n.uScale,W.scale),e.uniform1f(n.uYOff,W.yOff),e.uniform4f(n.uFade,s.fade[0],s.fade[1],s.fade[2],s.fade[3]),e.uniform1f(n.uAlpha,B.alpha),e.bindBuffer(e.ARRAY_BUFFER,B.buf);let R=[];for(let[E,y,I]of ct){let H=v.a[E];H===void 0||H<0||(e.enableVertexAttribArray(H),e.vertexAttribPointer(H,y,e.FLOAT,!1,56,I),R.push(H))}e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,B.ib),e.drawElements(e.TRIANGLES,B.count,e.UNSIGNED_SHORT,0),R.forEach(E=>e.disableVertexAttribArray(E)),B.alpha<1&&(d=!0)}function mt(o,r){e.bindBuffer(e.ARRAY_BUFFER,r.vb),e.enableVertexAttribArray(o.a.aUV),e.vertexAttribPointer(o.a.aUV,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,r.ib),e.drawElements(e.TRIANGLES,r.count,e.UNSIGNED_SHORT,0)}function vt(o){j=0,P=o||performance.now();let r=Math.min(100,P-Ee);Ee=P,V.reduced||(ce+=r/1e3),(N||!u)&&(N=!1,b()),ke(),dt(r),d=!1,ue()}function ue(){j||Be||be||document.hidden||V.reduced&&!d||(j=requestAnimationFrame(vt))}function dt(o){if(V.reduced||o<=0)return;de=$(de,o,.05);let r=1e3/((i?C.mobileMinFps:C.minFps)-2);if(de>r?(we+=o,Te=0):de<1e3/58&&(Te+=o,we=0),x===te.length-1&&de>1e3/18?P-Oe>1500&&(Le+=o):Le=0,Le>(i?6e3:2500)&&!window.__TMR_KEEP_GL){Be=!0,j&&cancelAnimationFrame(j),j=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl");return}we>1500&&x<te.length-1?(x++,we=0,N=!0):Te>(i?2e4:8e3)&&x>0&&(x--,Te=0,N=!0)}return document.addEventListener("visibilitychange",()=>{document.hidden?j&&(cancelAnimationFrame(j),j=0):(Ee=performance.now(),ue())}),addEventListener("scroll",()=>{d=!0,ue()},{passive:!0}),addEventListener("pointerdown",()=>Oe=performance.now(),{passive:!0}),t.addEventListener("webglcontextlost",o=>{o.preventDefault(),be=!0,B.ready=!1,j&&cancelAnimationFrame(j),j=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl")}),t.addEventListener("webglcontextrestored",()=>{if(!Be){try{Y(),K(),_(),ie(),pe.last="",u=null,ze()}catch(o){console.warn("scene restore",o);return}be=!1,N=!0,d=!0,Ee=performance.now(),document.documentElement.classList.remove("no-gl"),document.documentElement.classList.add("gl"),ue()}}),b(),N=!1,P=performance.now(),ft=P,ke(),ue(),g.invalidate&&g.invalidate(),!0}export{yt as startScene};
