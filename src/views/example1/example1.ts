import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { DirectionalLight, Side } from 'three';

@Component({})
export default class Example1 extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;

  private mounted() {
    const width = this.$refs.renderer.clientWidth;
    const height = this.$refs.renderer.clientHeight;

    //Scene은 물체를 등록.

    //Camera
    //Perspective - 원근법 (3D)
    //Orthographic - 2D

    //aspect 종횡비
    // fov (field of View) : 화각 () 확대를 하고싶으면 fov를 줄이면 된다.
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);

    // this.camera = new THREE.OrthographicCamera(
    //   -2 * (width / height),
    //   2 * (width / height),
    //   -2,
    //   2,
    //   -1,
    //   1000
    // );

    // this.camera = new THREE.OrthographicCamera(
    //   -(width / 2),
    //   width / 2,
    //   -(height / 2),
    //   height / 2,
    //   -1,
    //   1000
    // );

    this.renderer = new THREE.WebGLRenderer();
    // 화면에 보이는 버퍼..

    this.renderer.setSize(
      this.$refs.renderer.clientWidth,
      this.$refs.renderer.clientHeight
    );

    this.$refs.renderer.appendChild(this.renderer.domElement);

    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);

    const x = 2;
    const y = 2;

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(x * y * 18);

    let num = 0;
    for (let j = 0; j < y; j++) {
      for (let i = 0; i < x; i++) {
        vertices.set(
          [i, -j, 1, i + 1, -j, 1, i + 1, 1, 1, i + 1, 1, 1, i, 1, 1, i, -j, 1],
          (i + j * x) * 18
        );
      }
    }

    geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(geometry, material);

    this.scene.add(cube);
    this.camera.position.z = 5;

    this.update();
  }

  private update() {
    requestAnimationFrame(this.update);
    // 렌더링을 다시 해줘
    // this는 class가 주인인데, 시스템에서 호출할 때는 this가 바껴서 들어와서 this.render를 찾을 수 없는 것.
    this.renderer.render(this.scene, this.camera);
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;
  }
}
