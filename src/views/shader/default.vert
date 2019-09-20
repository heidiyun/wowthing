precision mediump float;
precision mediump int;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix; 
uniform float time;
uniform float random;
attribute vec3 position;
attribute vec4 color;
attribute vec3 offset;
attribute vec4 orientationStart;
attribute vec4 orientationEnd;
varying vec3 vPosition;
varying vec4 vColor;

void main()	{
    vec3 pos = position;
    vColor = color;
    
    pos.x = (pos.x / 2.0 + (pos.x / 2.0  + 1.2) * time); 
    pos.y = (pos.y / 2.0 + (pos.y / 2.0 + 1.2) * time);
    pos.z = sin(pos.z  * time) * 10.0 ;

    vPosition = pos;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    
}

