precision mediump float;
precision mediump int;
uniform mat4 modelViewMatrix; // optional
uniform mat4 projectionMatrix; // optional
// cpu 단에서 gpu단으로 공용 정보를 넘겨준다. 
// 정점에 따라 변하지 않는 상수 값. -> uniform
// 모든 정점의 스레드가 같은 메모리 영역을 참조한다. 

uniform float time;

attribute vec3 position;
            // geometry에 넣어주는 정보
            // 3개로 잘라서 넣어준다. 0~2가 하나의 정점
attribute vec4 color;
varying vec3 vPosition;
// varying vertext shader에서 fragment shader로 정보를 넘기는 것. 
varying vec4 vColor;
// 정점 3개에 대한 선형보간을 한 내 픽셀에 대한 색을 넘겨주는 것이 frag-color
// 정점 3개에 대한 정보를 넘겨주는게 vColor
// 그냥 정보를 넘겨주는 역할. 
// 선형보간은 하드웨어에서 알아서 해준다. 결국 frag로 넘어갈때 선형보간된 값이 넣어지는 것이고 여기서는 선형보간이 일어나지 않는다.!


void main()	{
    vec3 pos = position;
    pos.z = sin(position.x * 0.5 + time); 
    // position.z = sin(position.y * 0.3);
    // -> 위처럼 재정의하면 안되나봐....
    // vPosition = position; 
    vColor = color;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    // 화면에 물체가 어디에 보일지.
    // 카메라 위치에 대해 화면의 물체가 어디에 위치해 있는지 결정하는 로직.
}

// main은 하나의 정점당 실행되는 코드.
// 병렬로 실행된다. 400개의 정점이 있으면 400번의 main이 병렬로 실행된다.

// 화면에 보이는 Object 3D는 매트릭스를 갖고 있어서 이동하고 회전하고 사이즈 조절하고 가 가능함..
// 메트릭스는 이동 회전 크기에 대한 값을 가지고 있다.