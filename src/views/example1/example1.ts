import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({})
export default class Example1 extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;
  private cube!: THREE.Mesh;
  private material!: THREE.MeshBasicMaterial;
  private geometry: THREE.BufferGeometry = new THREE.BufferGeometry();
  private value: number = 0;
  private control!: OrbitControls;

  private mounted() {
    const width = this.$refs.renderer.clientWidth;
    const height = this.$refs.renderer.clientHeight;

    //Scene은 물체를 등록.

    //Camera
    //Perspective - 원근법 (3D)
    //Orthographic - 2D

    //aspect 종횡비
    // fov (field of View) : 화각 () 확대를 하고싶으면 fov를 줄이면 된다.
    this.camera = new THREE.PerspectiveCamera(200, width / height, 0.1, 1000);

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

    const x = 20;
    const y = 20;

    // const vertices = new Float32Array(x * y * 18);

    // for (let j = 0; j < y; j++) {
    //   for (let i = 0; i < x; i++) {
    //     vertices.set(
    //       [i, -j, 1, i + 1, -j, 1, i + 1, 1, 1, i + 1, 1, 1, i, 1, 1, i, -j, 1],
    //       (i + j * x) * 18
    //     );
    //   }
    // }

    const vertices = new Float32Array((x + 1) * (y + 1) * 3);
    const colors = new Float32Array((x + 1) * (y + 1) * 3);

    for (let j = 0; j < y + 1; j++) {
      for (let i = 0; i < x + 1; i++) {
        vertices.set(
          [i - (x - x / 2), j - (y - y / 2), 1],
          (i + j * (x + 1)) * 3
        );
      }
    }

    const indices: number[] = [];

    for (let i = 0; i < x * y; i++) {
      const std = (x + 1) * (Math.floor(i / x) + 1) + (i % x);
      indices.push(std);
      indices.push(std + 1);
      indices.push(std - x);
      indices.push(std - x);
      indices.push(std - (x + 1));
      indices.push(std);
    }

    this.geometry.setIndex(indices);

    this.geometry.addAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(vertices), 3)
    );

    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.update();

    this.scene.add(this.cube);
    this.camera.position.z = 5;

    this.update();
  }

  private update() {
    requestAnimationFrame(this.update);
    // 렌더링을 다시 해줘
    // this는 class가 주인인데, 시스템에서 호출할 때는 this가 바껴서 들어와서 this.render를 찾을 수 없는 것.

    this.control.update();
    this.value += 0.2;

    let t = 0;
    for (
      let i = 0;
      i < this.geometry.getAttribute('position').array.length;
      i++
    ) {
      t += 0.2;
      // 값이 커질수록 물결이 많아짐..왜?
      if (i % 3 === 2) {
        this.geometry.getAttribute('position').array[i] +=
          Math.sin(this.value + t) * 0.02;
        // 값이 커질수록 범위가 커져서 폭이 커지는 것인가?
      }
    }

    this.geometry.getAttribute('position').needsUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }
}
