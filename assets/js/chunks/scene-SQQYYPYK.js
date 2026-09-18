import{a as ae,b as Me,c as De}from"./chunk-NAK7DINS.js";import{b as Ne,c as T,f as z,g as M}from"./chunk-MBL2NX2W.js";var Ae=`
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
`,Te=`
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,ze=`${Ae}
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
}`,Ve=`${Ae}
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
}`,Ie=`
uniform vec4 uRect;   // \u0446\u0435\u043D\u0442\u0440 \u0438 \u043F\u043E\u043B\u043E\u0432\u0438\u043D\u0430 \u0440\u0430\u0437\u043C\u0435\u0440\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430 \u0432 \u043A\u043E\u043E\u0440\u0434\u0438\u043D\u0430\u0442\u0430\u0445 \u044D\u043A\u0440\u0430\u043D\u0430 (-1..1)
uniform float uAspect; // \u0448\u0438\u0440\u0438\u043D\u0430 / \u0432\u044B\u0441\u043E\u0442\u0430 \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430
uniform float uCam;
vec4 project(vec3 p) {
  float k = uCam / (uCam - p.z);
  vec2 sp = p.xy * k;
  vec2 ndc = uRect.xy + vec2(sp.x, sp.y * uAspect) * uRect.zw;
  return vec4(ndc, clamp(-p.z * 0.15, -0.99, 0.99), 1.0);
}`,Oe=`
attribute vec2 aUV;
uniform float uTime;
uniform float uAmp;
uniform float uLift;
uniform float uWidth;
uniform vec2 uPath0;
uniform vec2 uPath1;
uniform vec3 uPtr;
${Ie}
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
}`,He=`
attribute vec2 aUV;
uniform float uTime;
uniform float uBreath;
uniform float uGust;
uniform float uHoverAmp;
uniform vec2 uHover;
uniform vec4 uRip[4];
uniform vec2 uTilt;   // \u043D\u0430\u043A\u043B\u043E\u043D \u0432\u043E\u043A\u0440\u0443\u0433 X \u0438 \u043F\u043E\u0432\u043E\u0440\u043E\u0442 \u0432\u043E\u043A\u0440\u0443\u0433 Y, \u0440\u0430\u0434\u0438\u0430\u043D\u044B
uniform float uScale;
uniform float uYOff;
${Ie}
varying vec3 vN;
varying vec3 vT;
varying vec2 vUV;
varying float vH;

float pebble(vec2 p) {
  vec2 q = abs(p) / vec2(0.44, 0.37);
  return pow(pow(q.x, 3.0) + pow(q.y, 3.0), 1.0 / 3.0);
}
float height(vec2 p) {
  float t = uTime;
  float r = pebble(p);
  float hh = 0.42 * (1.0 + 0.02 * sin(t * 0.9) * uBreath);
  float h = r < 1.0 ? hh * (1.0 - 0.3 * pow(r, 4.0)) : hh * 0.7 * exp(-(r - 1.0) * 3.1);
  float ang = atan(p.y, p.x);
  // \u0441\u043A\u043B\u0430\u0434\u043A\u0438 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u043E\u0442 \u043A\u0440\u0430\u044F \u0434\u0430\u0442\u0447\u0438\u043A\u0430
  float fa = 0.085 * smoothstep(0.92, 1.6, r) * (1.0 - 0.45 * smoothstep(2.2, 3.2, r)) * (1.0 + 0.22 * sin(t * 0.6 + ang * 2.0) * uBreath);
  float folds = sin(ang * 7.0 + 0.9 * sin(r * 1.7 + t * 0.25) + 0.6 * sin(ang * 3.0));
  h += fa * folds * (0.65 + 0.35 * sin(r * 2.3 - t * 0.4));
  // \u043C\u0435\u043B\u043A\u0430\u044F \u0440\u044F\u0431\u044C \u043F\u043E \u0432\u0441\u0435\u0439 \u0442\u043A\u0430\u043D\u0438
  h += 0.006 * sin(p.x * 13.0 + t * 0.8) * sin(p.y * 11.0 - t * 0.6) * smoothstep(0.9, 1.4, r);
  h += uGust * 0.06 * sin(p.x * 3.5 + p.y * 1.5 - t * 4.0) * smoothstep(0.9, 1.8, r);
  vec2 dh = p - uHover;
  h += uHoverAmp * 0.07 * exp(-dot(dh, dh) / 0.06) * (0.4 + smoothstep(1.0, 2.2, r));
  for (int i = 0; i < 4; i++) {
    vec4 rp = uRip[i];
    if (rp.w <= 0.001) continue;
    float dist = length(p - rp.xy);
    float R = rp.z * 1.1;
    float env = exp(-rp.z * 1.4) * rp.w;
    float x = dist - R;
    h += 0.038 * env * sin(x * 16.0) * exp(-x * x * 12.0);
  }
  return h;
}
vec3 view(vec3 q) {
  // q: x \u2014 \u0432\u043F\u0440\u0430\u0432\u043E, y \u2014 \u0432\u044B\u0441\u043E\u0442\u0430 \u0442\u043A\u0430\u043D\u0438, z \u2014 \u0432\u0433\u043B\u0443\u0431\u044C \u0441\u0446\u0435\u043D\u044B
  float ca = cos(uTilt.x); float sa = sin(uTilt.x);
  vec3 v = vec3(q.x, q.z * sa + q.y * ca, q.y * sa - q.z * ca);
  float cb = cos(uTilt.y); float sb = sin(uTilt.y);
  return vec3(v.x * cb + v.z * sb, v.y, -v.x * sb + v.z * cb);
}
void main() {
  vec2 p = aUV;
  float e = 0.01;
  float h = height(p);
  float hx = height(p + vec2(e, 0.0)) - height(p - vec2(e, 0.0));
  float hz = height(p + vec2(0.0, e)) - height(p - vec2(0.0, e));
  vec3 n = normalize(vec3(-hx, 2.0 * e, -hz));
  vec3 tx = normalize(vec3(2.0 * e, hx, 0.0));
  vN = normalize(view(n));
  vT = normalize(view(tx));
  vUV = aUV;
  vH = h;
  vec3 v = view(vec3(p.x, h, p.y)) * uScale;
  v.y += uYOff;
  gl_Position = project(v);
}`,ge=`${Ae}
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
}`;function Ye(r,h,A){let a=r.createShader(h);if(r.shaderSource(a,A),r.compileShader(a),!r.getShaderParameter(a,r.COMPILE_STATUS)){let e=r.getShaderInfoLog(a);throw r.deleteShader(a),new Error(`shader: ${e}`)}return a}function Q(r,h,A){let a=r.createProgram();if(r.attachShader(a,Ye(r,r.VERTEX_SHADER,h)),r.attachShader(a,Ye(r,r.FRAGMENT_SHADER,A)),r.linkProgram(a),!r.getProgramParameter(a,r.LINK_STATUS))throw new Error(`link: ${r.getProgramInfoLog(a)}`);let e={},s=r.getProgramParameter(a,r.ACTIVE_UNIFORMS);for(let m=0;m<s;m++){let y=r.getActiveUniform(a,m),g=y.name.replace(/\[0\]$/,"");e[g]=r.getUniformLocation(a,y.name)}let d={},l=r.getProgramParameter(a,r.ACTIVE_ATTRIBUTES);for(let m=0;m<l;m++){let y=r.getActiveAttrib(a,m);d[y.name]=r.getAttribLocation(a,y.name)}return{p:a,u:e,a:d}}function be(r,h,A,a,e){let s=new Float32Array((h+1)*(A+1)*2),d=0;for(let g=0;g<=A;g++)for(let P=0;P<=h;P++)s[d++]=a(P/h),s[d++]=e(g/A);let l=new Uint16Array(h*A*6);d=0;for(let g=0;g<A;g++)for(let P=0;P<h;P++){let O=g*(h+1)+P,D=O+1,E=O+h+1,$=E+1;l[d++]=O,l[d++]=E,l[d++]=D,l[d++]=D,l[d++]=E,l[d++]=$}let m=r.createBuffer();r.bindBuffer(r.ARRAY_BUFFER,m),r.bufferData(r.ARRAY_BUFFER,s,r.STATIC_DRAW);let y=r.createBuffer();return r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,y),r.bufferData(r.ELEMENT_ARRAY_BUFFER,l,r.STATIC_DRAW),{vb:m,ib:y,count:l.length}}function We(r,h,A){let a=r.createTexture();r.bindTexture(r.TEXTURE_2D,a),r.texImage2D(r.TEXTURE_2D,0,r.RGBA,h,A,0,r.RGBA,r.UNSIGNED_BYTE,null),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE);let e=r.createFramebuffer();return r.bindFramebuffer(r.FRAMEBUFFER,e),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,a,0),r.bindFramebuffer(r.FRAMEBUFFER,null),{tex:a,fb:e,w:h,h:A}}function _(r){let h=String(r||"#000").replace("#",""),A=h.length===3?h.split("").map(e=>e+e).join(""):h,a=parseInt(A,16);return[(a>>16&255)/255,(a>>8&255)/255,(a&255)/255]}var W=["hero","about","device","roadmap","join","footer"],Ge=Math.PI/180;function lt(r,h={},A={}){let a=!Ne.finePointer.matches||Math.min(innerWidth,innerHeight)<620,e=r.getContext("webgl",{alpha:!1,antialias:!a,depth:!0,stencil:!1,premultipliedAlpha:!1,powerPreference:"high-performance"})||r.getContext("experimental-webgl");if(!e)return!1;let s,d,l,m;try{s=Q(e,Te,ze),d=Q(e,Te,Ve),l=Q(e,Oe,ge),m=Q(e,He,ge)}catch(t){return console.warn(t),!1}let y=Object.assign({maxDpr:1.75,mobileMaxDpr:1.35,bgScale:.5,mobileBgScale:.34,minFps:50},h.quality),g=Object.assign({speed:.07,warp:1,grain:.03,blend:.2},h.flow),P=Object.assign({follow:.08,size:.3,intensity:.55,burst:1},h.spots),O=Object.assign({colorA:"#2A8FE0",colorB:"#A77BA5",colorC:"#1A2C66",sheen:"#E6F6FF",sheen2:"#2EE6C5",rim:"#79D3FF",speed:1,amplitude:1,opacityMobile:.72},h.silk),D=Object.assign({colorA:"#294A8C",colorB:"#4A3F8F",colorC:"#0C1737",sheen:"#CBEBFF",sheen2:"#2EE6C5",rim:"#C9A7EA",breath:1,ripple:1,tilt:57,turn:-14},h.drape),E=W.map(t=>{let o=h.palette&&h.palette[t]||{};return{a:_(o.a||"#0B1E40"),b:_(o.b||"#102A56"),c:_(o.c||"#1D4D8F"),s1:_(o.spot1||"#009FE1"),s2:_(o.spot2||"#2EE6C5"),edge:_(o.edge||o.spot1||"#009FE1"),light:!!o.light}}),$=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,$),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),e.STATIC_DRAW);let Xe=be(e,a?150:240,a?18:28,t=>t,t=>t*2-1),je=be(e,a?110:160,a?110:160,t=>t*2-1,t=>t*2-1);(()=>{e.useProgram(s.p);let t=o=>new Float32Array([...E.flatMap(n=>n[o]),...E[E.length-1][o]]);e.uniform3fv(s.u.uC0,t("a")),e.uniform3fv(s.u.uC1,t("b")),e.uniform3fv(s.u.uC2,t("c"));for(let[o,n,i]of[[l,O,0],[m,D,1]])e.useProgram(o.p),e.uniform3fv(o.u.uColA,_(n.colorA)),e.uniform3fv(o.u.uColB,_(n.colorB)),e.uniform3fv(o.u.uColC,_(n.colorC)),e.uniform3fv(o.u.uSheen,_(n.sheen)),e.uniform3fv(o.u.uSheen2,_(n.sheen2)),e.uniform3fv(o.u.uRim,_(n.rim)),e.uniform1f(o.u.uMode,i),e.uniform3fv(o.u.uL1,i?[-.45,.75,.55]:[-.35,.8,.55]),e.uniform3fv(o.u.uL2,i?[.75,.55,.35]:[.7,-.35,.45]),e.uniform3fv(o.u.uSpec,i?[n.spec??.75,.32,.11]:[n.spec??.7,.3,.1])})();let ce=[1,.85,.7,.58,.48],G=0,H=0,b=0,F=null;function j(){H=r.clientWidth||innerWidth,b=r.clientHeight||innerHeight;let t=a?y.mobileMaxDpr:y.maxDpr,o=Math.min(devicePixelRatio||1,t)*ce[G],n=Math.max(1,Math.round(H*o)),i=Math.max(1,Math.round(b*o));(r.width!==n||r.height!==i)&&(r.width=n,r.height=i);let u=(a?y.mobileBgScale:y.bgScale)*(G>2?.8:1),f=Math.max(2,Math.round(H*u)),p=Math.max(2,Math.round(b*u));(!F||F.w!==f||F.h!==p)&&(F&&(e.deleteTexture(F.tex),e.deleteFramebuffer(F.fb)),F=We(e,f,p)),Re(),q=!0}let q=!0;"ResizeObserver"in window?new ResizeObserver(()=>j()).observe(r):addEventListener("resize",j);let w=T.pointer,ue=(t,o,n)=>{w.x=t,w.y=o,w.active=!0,w.type=n,w.t=performance.now()};addEventListener("pointermove",t=>ue(t.clientX,t.clientY,t.pointerType),{passive:!0}),addEventListener("touchstart",t=>t.touches[0]&&ue(t.touches[0].clientX,t.touches[0].clientY,"touch"),{passive:!0}),addEventListener("touchmove",t=>t.touches[0]&&ue(t.touches[0].clientX,t.touches[0].clientY,"touch"),{passive:!0}),document.addEventListener("mouseleave",()=>w.active=!1);let Z=document.querySelector("[data-stage]"),J=[],k=0,fe=0,ee=[0,0],we=0,te=[];function qe(){let t=T.rects.stage;return t?{left:t.left,top:t.top-window.scrollY,width:t.width,height:t.height}:null}let ke=ae.scale,$e=ae.yOff,Ke=ae.cam;function Re(){let t=T.rects.stage;if(!t)return;let o=t.width/t.height;te=[];let n=36;for(let i=0;i<=n;i++)for(let u=0;u<=n;u++){let f=u/n*2-1,p=i/n*2-1,[S,x,U]=De(f,Me(f,p),p,D.tilt,D.turn,o);te.push([S,x,U,f,p])}}function ye(t,o){let n=qe();if(!n||!te.length)return null;let i=(t-(n.left+n.width/2))/(n.width/2),u=-(o-(n.top+n.height/2))/(n.height/2),f=null,p=1/0,S=null,x=-1/0;for(let C of te){let I=(C[0]-i)**2+(C[1]-u)**2;I<p&&(p=I,f=C),I<.004&&C[2]>x&&(x=C[2],S=C)}let U=S||f;return!U||p>.09?null:[U[3],U[4]]}function Fe(t,o){J.unshift({x:t[0],z:t[1],t0:R,amp:o}),J.length>4&&(J.length=4)}Z&&!T.reduced&&(Z.addEventListener("pointermove",t=>{let o=ye(t.clientX,t.clientY);if(!o){k=0;return}ee=o,k=1,t.pointerType==="mouse"&&R-we>420&&(we=R,Fe(o,.55*D.ripple))},{passive:!0}),Z.addEventListener("pointerleave",()=>k=0),Z.addEventListener("pointerdown",t=>{let o=ye(t.clientX,t.clientY);o&&(ee=o,k=1,Fe(o,1*D.ripple),t.pointerType!=="mouse"&&setTimeout(()=>k=0,900))},{passive:!0}));let se=Array.from({length:8},()=>({x:.5,y:.5,r:.2,a:0,c:[0,0,0]})),V=[{x:.7,y:.35},{x:.62,y:.45}],Y=[];function Se(t,o,n,i=3,u=1){for(let f=0;f<i;f++)Y.push({x:z(t+(Math.random()-.5)*.5*u,.02,.98),y:z(o+(Math.random()-.5)*.18*u,-.1,1.1),r0:.05,r1:(.22+Math.random()*.18)*P.size*3*u,t0:R+f*90,dur:1500+Math.random()*700,c:n[f%n.length]});for(;Y.length>6;)Y.shift()}addEventListener("tmr:burst",t=>{let o=t.detail||{},n=(o.x??H/2)/H,i=(o.y??b/2)/b,u=le(i);Se(n,i,[E[u].s1,E[u].s2,_("#FFFFFF")],4,.8),q=!0});let B=[];function _e(){B=W.map(t=>T.sections.find(o=>o.id===t)).filter(Boolean)}T.events.addEventListener("measure",()=>{_e(),Re(),q=!0}),_e();function le(t){let o=window.scrollY+t*b;for(let n=0;n<B.length;n++){let i=B[n];if(o<i.top+i.height)return W.indexOf(i.id)}return W.length-1}function Qe(t,o){let n=t*b,i=g.blend*b,u=E[W.indexOf(B[0]?B[0].id:"hero")][o];for(let f=0;f<B.length-1;f++){let p=B[f],S=p.top+p.height-window.scrollY,x=z((n-(S-i))/(2*i)),U=x*x*(3-2*x),C=E[W.indexOf(B[f+1].id)][o];u=u.map((I,c)=>M(I,C[c],U))}return u}let me=-1,L=0,R=performance.now(),Ze=R,X=12,K=16.7,oe=0,re=0,pe=0,Pe=!1,he=R,ve=0,Be=window.scrollY,de=.3;function Ce(){let t=window.scrollY,o=t-Be;Be=t,ve=M(ve,z(Math.abs(o)/45),.08),e.bindFramebuffer(e.FRAMEBUFFER,F.fb),e.viewport(0,0,F.w,F.h),e.disable(e.DEPTH_TEST),e.disable(e.BLEND),e.useProgram(s.p),e.uniform2f(s.u.uRes,F.w,F.h),e.uniform1f(s.u.uTime,X*g.speed),e.uniform1f(s.u.uWarp,g.warp),e.uniform1f(s.u.uBlend,g.blend);let n=new Float32Array(6),i=B.map(c=>W.indexOf(c.id));for(let c=0;c<B.length-1&&c<6;c++){let v=B[c];n[c]=(v.top+v.height-t)/b}e.uniform1fv(s.u.uB,n),e.uniform1i(s.u.uN,Math.max(1,B.length)),i.join()!==ne.last&&ne(i);let u=!w.active||R-w.t>6e3,f=u?.5+.32*Math.sin(X*.13):w.x/H,p=u?.42+.22*Math.sin(X*.17+1.2):w.y/b,S=T.reduced?1:P.follow;V[0].x=M(V[0].x,f+.04,S),V[0].y=M(V[0].y,p-.05,S),V[1].x=M(V[1].x,f-.06,S*.45),V[1].y=M(V[1].y,p+.07,S*.45);let x=le(.5),U=E[x]&&E[x].light;for(let c=0;c<2;c++){let v=se[c];v.x=V[c].x,v.y=V[c].y,v.r=P.size*(c?.72:1);let N=E[le(z(v.y,0,1))].light;v.a=P.intensity*(N?.45:1)*(c?.8:1),v.c=Qe(v.y,c?"s2":"s1")}if(x!==me){if(me!==-1&&!T.reduced){let c=B.find(N=>W.indexOf(N.id)===x),v=c?z((c.top-t)/b,.05,.95):.5;Se(.5,v,[E[x].s1,E[x].s2],3,1.2*P.burst)}me=x}for(let c=0;c<6;c++){let v=se[c+2],N=Y[c];if(!N){v.a=0;continue}let xe=(R-N.t0)/N.dur;if(xe<0){v.a=0;continue}let rt=1-Math.pow(1-z(xe),3);v.x=N.x,v.y=N.y,v.r=M(N.r0,N.r1,rt),v.a=Math.pow(z(1-xe),2)*.85,v.c=N.c}for(let c=Y.length-1;c>=0;c--)R-Y[c].t0>Y[c].dur&&Y.splice(c,1);let C=new Float32Array(32),I=new Float32Array(24);se.forEach((c,v)=>{C.set([c.x,c.y,c.r,c.a],v*4),I.set(c.c,v*3)}),e.uniform4fv(s.u.uSpot,C),e.uniform3fv(s.u.uSpotC,I),e.bindBuffer(e.ARRAY_BUFFER,$),e.enableVertexAttribArray(s.a.aPos),e.vertexAttribPointer(s.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,r.width,r.height),e.useProgram(d.p),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,F.tex),e.uniform1i(d.u.uTex,0),e.uniform1f(d.u.uTime,X),e.uniform1f(d.u.uGrain,g.grain*(U?.6:1)),de=M(de,U?0:.34,.08),e.uniform1f(d.u.uVignette,de),e.bindBuffer(e.ARRAY_BUFFER,$),e.enableVertexAttribArray(d.a.aPos),e.vertexAttribPointer(d.a.aPos,2,e.FLOAT,!1,0,0),e.drawArrays(e.TRIANGLES,0,3),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL),e.clear(e.DEPTH_BUFFER_BIT),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),Je(t),et(t),e.disableVertexAttribArray(0)}function ne(t){ne.last=t.join(),e.useProgram(s.p);let o=t.length?t:[0],n=u=>{let f=[];for(let p=0;p<7;p++)f.push(...E[o[Math.min(p,o.length-1)]][u]);return new Float32Array(f)};e.uniform3fv(s.u.uC0,n("a")),e.uniform3fv(s.u.uC1,n("b")),e.uniform3fv(s.u.uC2,n("c"));let i=[];for(let u=0;u<6;u++)i.push(...E[o[Math.min(u+1,o.length-1)]].edge);e.uniform3fv(s.u.uEdge,new Float32Array(i)),e.uniform1f(s.u.uEdgeAmt,g.edge??.5)}ne.last="";function Le(t,o){let n=(o.left+o.width/2)/H*2-1,i=1-(o.top+o.height/2)/b*2;e.uniform4f(t.u.uRect,n,i,o.width/H,o.height/b),e.uniform1f(t.u.uAspect,o.width/o.height)}let Ee=0;function Je(t){let o=T.rects.hero;if(!o)return;let n=Math.min(o.height,b*1.02),i={left:o.left,top:o.top-t,width:o.width,height:n};if(i.top+i.height<-40||i.top>b)return;let u=i.width/i.height,f=1/u,p=u<1;e.useProgram(l.p),Le(l,i),e.uniform1f(l.u.uCam,3.4),e.uniform1f(l.u.uTime,X*O.speed),e.uniform1f(l.u.uAmp,(p?.34:.3)*O.amplitude);let S=z(-i.top/(i.height*.9));e.uniform1f(l.u.uLift,S),e.uniform1f(l.u.uWidth,p?.34:.21),p?(e.uniform2f(l.u.uPath0,-1.4,-f*.62),e.uniform2f(l.u.uPath1,1.4,-f*.02)):(e.uniform2f(l.u.uPath0,-1.3,-f*1.05),e.uniform2f(l.u.uPath1,1.3,f*.5));let x=w.active&&w.y>i.top&&w.y<i.top+i.height;Ee=M(Ee,x&&!T.reduced?1:0,.06);let U=(w.x-(i.left+i.width/2))/(i.width/2),C=-(w.y-(i.top+i.height/2))/(i.width/2);e.uniform3f(l.u.uPtr,U,C,Ee);let I=(a?O.opacityMobile:.96)*(1-z((S-.35)/.65));e.uniform1f(l.u.uAlpha,I),Ue(l,Xe)}function et(t){let o=T.rects.stage;if(!o)return;let n={left:o.left,top:o.top-t,width:o.width,height:o.height};if(n.top+n.height<-60||n.top>b+60)return;e.useProgram(m.p),Le(m,n),e.uniform1f(m.u.uCam,Ke),e.uniform1f(m.u.uTime,X),e.uniform1f(m.u.uBreath,T.reduced?0:D.breath),e.uniform1f(m.u.uGust,T.reduced?0:ve),fe=M(fe,k,.07),e.uniform1f(m.u.uHoverAmp,fe),e.uniform2f(m.u.uHover,ee[0],ee[1]);let i=new Float32Array(16);J.forEach((u,f)=>{let p=(R-u.t0)/1e3;i.set([u.x,u.z,p,p<4?u.amp:0],f*4)}),e.uniform4fv(m.u.uRip,i),e.uniform2f(m.u.uTilt,D.tilt*Ge,D.turn*Ge),e.uniform1f(m.u.uScale,ke),e.uniform1f(m.u.uYOff,$e),e.uniform1f(m.u.uAlpha,1),Ue(m,je)}function Ue(t,o){e.bindBuffer(e.ARRAY_BUFFER,o.vb),e.enableVertexAttribArray(t.a.aUV),e.vertexAttribPointer(t.a.aUV,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,o.ib),e.drawElements(e.TRIANGLES,o.count,e.UNSIGNED_SHORT,0)}function tt(t){L=0,R=t||performance.now();let o=Math.min(100,R-he);he=R,T.reduced||(X+=o/1e3),F||j(),Ce(),ot(o),q=!1,ie()}function ie(){L||Pe||document.hidden||T.reduced&&!q||(L=requestAnimationFrame(tt))}function ot(t){if(T.reduced||t<=0)return;K=M(K,t,.05);let o=1e3/(y.minFps-2);if(K>o?(oe+=t,re=0):K<1e3/58&&(re+=t,oe=0),G===ce.length-1&&K>1e3/18?pe+=t:pe=0,pe>2500&&!window.__TMR_KEEP_GL){Pe=!0,L&&cancelAnimationFrame(L),L=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl");return}oe>1500&&G<ce.length-1?(G++,oe=0,j()):re>8e3&&G>0&&(G--,re=0,j())}return document.addEventListener("visibilitychange",()=>{document.hidden?L&&(cancelAnimationFrame(L),L=0):(he=performance.now(),ie())}),addEventListener("scroll",()=>{q=!0,ie()},{passive:!0}),r.addEventListener("webglcontextlost",t=>{t.preventDefault(),L&&cancelAnimationFrame(L),L=0,document.documentElement.classList.remove("gl"),document.documentElement.classList.add("no-gl")}),j(),R=performance.now(),Ze=R,Ce(),ie(),A.invalidate&&A.invalidate(),!0}export{lt as startScene};
