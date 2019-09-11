precision mediump float;
precision mediump int;
uniform float time;
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
vec4 color = vec4( vColor );

color.r += sin( vPosition.y  + time ) * 0.5;
color.g += sin( vPosition.x  + time ) * 0.5;
color.b += sin( vPosition.z  + time ) * 0.5;
gl_FragColor = color;

// gl_FragColor = vec4(1,1,1,1);
// 모든 픽셀 수 만큼 이 코드가 동작했다. 
			}