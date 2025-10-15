precision highp float;
uniform vec3 color;

varying vec3 vNormal;
varying float noise;
varying vec2 dxy;
void main() {
    // vec3 colorA = vec3(0.91, 0.14, 0.14);
    // vec3 colorB = vec3(1.0, 0.97, 0.22);
    // vec3 color = mix(colorA, colorB, noise);
    // color = color * normalize(vNormal);
    // vec3 color = vec3(vec3(normalize(vNormal) * mixValue)); /** normalize(vNormal) * .5 + .5;*/
    gl_FragColor = vec4(0.68, 0.68, 0.68, 1.0);

    // vec2 debug = normalize( dxy );
    // gl_FragColor = vec4(debug, 0., 1.0);
}