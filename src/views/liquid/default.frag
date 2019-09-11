precision mediump float;
precision mediump int;
uniform float time;
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;

void main()	{
// vec4 color = vec4( vColor );
// color.r += sin( vPosition.x * 10.0 + time ) * 0.5;
// gl_FragColor = color;
// gl_FragColor = vec4(1,1,1,1);

vec2 uv = vUv;
// vec4 normal2 = texture2D(texture2, uv + vec2(0, time * 0.06));
vec4 normal = texture2D(texture2, uv + vec2(0, time * 0.06));
vec4 tex = texture2D(texture1 , vUv + normal.xy * 0.3);

// gl_FragColor = texture2D(texture1 , uv);
gl_FragColor =tex;
}