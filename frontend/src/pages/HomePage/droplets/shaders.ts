// Based on Yuki Kojima / Codrops. See ATTRIBUTION.md.
export const vertexShader = `attribute vec3 position;

void main() {
    gl_Position = vec4(position, 1.0);
}`;

export const fragmentShader = `precision mediump float;

const int TRAIL_LENGTH = 15;
const float EPS = 1e-4;
const int ITR = 16;

uniform float uTime;
uniform float uColorSpeed;
uniform float uIntroDuration;
uniform vec3 uBlobColor;
uniform vec3 uBackgroundColor;
uniform float uScroll;
uniform float uIntroTime;
uniform bool uTextOverlay;
uniform sampler2D uTextMask;
uniform vec3 uTextHoverColor;
uniform sampler2D uOutlineMask;
uniform vec3 uOutlineColor;
uniform vec3 uOutlineHoverColor;
uniform vec2 uResolution;
uniform float uTitleOffset;
uniform vec2 uPointerTrail[TRAIL_LENGTH];
uniform bool uShowStaticBlob;


float rnd3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);

    float a000 = rnd3D(i); // (0,0,0)
    float a100 = rnd3D(i + vec3(1.0, 0.0, 0.0)); // (1,0,0)
    float a010 = rnd3D(i + vec3(0.0, 1.0, 0.0)); // (0,1,0)
    float a110 = rnd3D(i + vec3(1.0, 1.0, 0.0)); // (1,1,0)
    float a001 = rnd3D(i + vec3(0.0, 0.0, 1.0)); // (0,0,1)
    float a101 = rnd3D(i + vec3(1.0, 0.0, 1.0)); // (1,0,1)
    float a011 = rnd3D(i + vec3(0.0, 1.0, 1.0)); // (0,1,1)
    float a111 = rnd3D(i + vec3(1.0, 1.0, 1.0)); // (1,1,1)

    vec3 u = f * f * (3.0 - 2.0 * f);
    // vec3 u = f*f*f*(f*(f*6.0-15.0)+10.0);

    float k0 = a000;
    float k1 = a100 - a000;
    float k2 = a010 - a000;
    float k3 = a001 - a000;
    float k4 = a000 - a100 - a010 + a110;
    float k5 = a000 - a010 - a001 + a011;
    float k6 = a000 - a100 - a001 + a101;
    float k7 = -a000 + a100 + a010 - a110 + a001 - a101 - a011 + a111;

    return k0 + k1 * u.x + k2 * u.y + k3 *u.z + k4 * u.x * u.y + k5 * u.y * u.z + k6 * u.z * u.x + k7 * u.x * u.y * u.z;
}

// Camera
vec3 origin = vec3(0.0, 0.0, 1.0);
vec3 lookAt = vec3(0.0, 0.0, 0.0);
vec3 cDir = normalize(lookAt - origin);
vec3 cUp = vec3(0.0, 1.0, 0.0);
vec3 cSide = cross(cDir, cUp);

float smoothMin(float d1, float d2, float k) {
    // Equivalent soft union, stable even for small, widely separated blobs.
    return min(d1, d2) - log(1.0 + exp(-k * abs(d1 - d2))) / k;
}

vec3 translate(vec3 p, vec3 t) {
    return p - t;
}

float sdSphere(vec3 p, float s)
{
    return length(p) - s;
}

float addBlob(float d, vec3 p, vec2 center, float radius, float k) {
    float blob = sdSphere(p - vec3(center, 0.0), radius);
    return smoothMin(d, blob, k);
}

// Fall in once, then follow a scroll-controlled arc down and inward, then up.
// start/end: positions; dip: initial downward bend; delay: entrance stagger.
vec2 blobMotion(vec2 start, vec2 end, float dip, float delay, float radius) {
    // Immediate downward flow; horizontal movement builds into a wider turn.
    float t = 1.0 - pow(1.0 - clamp(uScroll, 0.0, 1.0), 1.35);
    vec2 center = mix(start, end, smoothstep(0.0, 1.0, t));
    float arcDepth = dip * 1.8;
    center.y = start.y - 2.0 * arcDepth * t * (1.0 - t)
        + (end.y - start.y) * t * t;

    float fall = smoothstep(0.0, uIntroDuration, uIntroTime - delay * 0.7);
    float top = uResolution.y / min(uResolution.x, uResolution.y);
    center.y = mix(top + radius + 0.6, center.y, fall);
    return center;
}


float map(vec3 p) {
    float baseRadius = 6e-3;
    float radius = baseRadius * float(TRAIL_LENGTH);
    float k = 7.0;
    float d = 1e5;

    // Visible extents in your shader space.
    // On a wide screen this becomes roughly vec2(1.7, 1.0).
    vec2 vp = uResolution / min(uResolution.x, uResolution.y);
    // Keep the final cluster compact even on wide or tall viewports.
    vec2 clusterCenter = vec2(0.0, 2.0 * uTitleOffset * vp.y);

    // --- Decorative blobs: entrance drop + scroll arcs ---
    if (uShowStaticBlob) {
        float progress = smoothstep(0.0, 1.0, uScroll);
        // Left-middle: dip down, then rise toward the title.
        d = addBlob(d, p, blobMotion(vec2(-vp.x + 0.14, 0.0),
            clusterCenter + vec2(-0.24, -0.06), 0.42, 0.10, 0.32), mix(0.20, 0.32, progress), k);

        // Upper-left accent.
        d = addBlob(d, p, blobMotion(vec2(-vp.x + 0.38, 0.55),
            clusterCenter + vec2(-0.16, 0.20), 0.38, 0.0, 0.20), mix(0.14, 0.20, progress), k);

        // Upper-right, larger.
        d = addBlob(d, p, blobMotion(vec2(vp.x - 0.28, 0.42),
            clusterCenter + vec2(0.22, 0.12), 0.48, 0.18, 0.44), mix(0.34, 0.44, progress), k);

        // Lower-right.
        d = addBlob(d, p, blobMotion(vec2(vp.x - 0.20, -0.50),
            clusterCenter + vec2(0.20, -0.20), 0.28, 0.30, 0.24), mix(0.24, 0.18, progress), k);

        // Preserve the raised starting position, then join the central cluster.
        d = addBlob(d, p, blobMotion(vec2(-vp.x * 0.30, vp.y * 0.66) + clusterCenter,
            clusterCenter + vec2(0.0, 0.26), 0.50, 0.06, 0.42), mix(0.42, 0.36, progress), k);

        // New small blob at the bottom.
        d = addBlob(d, p, blobMotion(vec2(-vp.x * 0.35, -vp.y * 0.68),
            clusterCenter + vec2(-0.06, -0.28), 0.20, 0.40, 0.15), mix(0.12, 0.15, progress), k);
    }

    // --- Pointer trail blobs ---
    for (int i = 0; i < TRAIL_LENGTH; i++) {
        float fi = float(i);
        vec2 pointerTrail = uPointerTrail[i] * uResolution / min(uResolution.x, uResolution.y);
        pointerTrail = mix(pointerTrail, clusterCenter, smoothstep(0.4, 1.0, uScroll));

        float sphere = sdSphere(
            translate(p, vec3(pointerTrail, 0.0)),
            radius - baseRadius * fi
        );

        d = smoothMin(d, sphere, k);
    }

    return d;
}

vec3 generateNormal(vec3 p) {
    return normalize(vec3(
            map(p + vec3(EPS, 0.0, 0.0)) - map(p + vec3(-EPS, 0.0, 0.0)),
            map(p + vec3(0.0, EPS, 0.0)) - map(p + vec3(0.0, -EPS, 0.0)),
            map(p + vec3(0.0, 0.0, EPS)) - map(p + vec3(0.0, 0.0, -EPS))
        ));
}

vec3 dropletColor(vec3 normal, vec3 rayDir) {
    vec3 reflectDir = reflect(rayDir, normal);

    float colorSpeed = uColorSpeed; // 0.0 = still, 1.0 = original speed.
    float noisePosTime = noise3D(reflectDir * 2.0 + uTime * colorSpeed);
    float noiseNegTime = noise3D(reflectDir * 2.0 - uTime * colorSpeed);

    // Target midtone after the existing difference blend on #fffbf1.
    // Compensate for both the background and pow(..., 7.0), keeping the glass lighting.
    vec3 targetColor = uBlobColor;
    vec3 backgroundColor = uBackgroundColor;
    vec3 tint = pow(max(abs(backgroundColor - targetColor), vec3(0.0001)), vec3(1.0 / 7.0))
        * (2.0 / 2.3) - vec3(0.4118, 0.4118, 0.4157);
    vec3 _color0 = tint * noisePosTime;
    vec3 _color1 = vec3(0.4118, 0.4118, 0.4157) * noiseNegTime;

    float intensity = 2.3;
    vec3 color = (_color0 + _color1) * intensity;

    return color;
}

void main() {
    float textMask = 0.0;
    float outlineMask = 0.0;
    if (uTextOverlay) {
        textMask = texture2D(uTextMask, gl_FragCoord.xy / uResolution).a;
        outlineMask = texture2D(uOutlineMask, gl_FragCoord.xy / uResolution).a;
        if (max(textMask, outlineMask) < 0.001) discard;
    }
    vec2 p = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);

    // Orthographic Camera
    vec3 ray = origin + cSide * p.x + cUp * p.y;
    vec3 rayDirection = cDir;

    float dist = 0.0;

    for (int i = 0; i < ITR; ++i) {
        dist = map(ray);
        ray += rayDirection * dist;
        if (dist < EPS) break;
    }

    if (uTextOverlay) {
        bool underBlob = dist < EPS;
        float fillAlpha = underBlob ? textMask : 0.0;
        vec3 outlineColor = underBlob ? uOutlineHoverColor : uOutlineColor;
        float alpha = outlineMask + fillAlpha * (1.0 - outlineMask);
        if (alpha < 0.001) discard;
        vec3 color = (outlineColor * outlineMask
            + uTextHoverColor * fillAlpha * (1.0 - outlineMask)) / alpha;
        gl_FragColor = vec4(color, alpha);
        return;
    }

    vec3 color = vec3(0.0);

    if (dist < EPS) {
        vec3 normal = generateNormal(ray);

        color = dropletColor(normal, rayDirection);
    }

    vec3 finalColor = pow(color, vec3(7.0));

    gl_FragColor = vec4(finalColor, 1.0);
}
`;
