precision mediump float;
precision mediump int;
uniform mat4 modelViewMatrix; 
uniform mat4 projectionMatrix; 
uniform float time;
uniform float random;
attribute vec2 uv;
attribute vec3 position;
attribute vec4 color;
varying vec3 vPosition;
varying vec4 vColor;
varying vec2 vUv;

void main()	{
    vPosition = position;
    vColor = color;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    
}
