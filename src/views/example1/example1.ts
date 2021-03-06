import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferAttribute, Vector2, Vector3 } from 'three';

interface SampleAttributes {
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
}

interface SampleProps {
  positions: Float32Array;
  color: Float32Array;
}

@Component({})
export default class Example1 extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;

  private geometry!: THREE.BufferGeometry;
  private material!: THREE.MeshBasicMaterial;
  private attribute!: SampleAttributes;
  private props!: SampleProps;

  private cube!: THREE.Mesh;
  private value: number = 0;
  private control!: OrbitControls;
  private mouse = new Vector3();

  private countX = 20;
  private countY = 20;

  private width = 0;
  private height = 0;

  private mounted() {
    this.width = this.$refs.renderer.clientWidth;
    this.height = this.$refs.renderer.clientHeight;

    // Scene은 물체를 등록.

    // Camera
    // Perspective - 원근법 (3D)
    // Orthographic - 2D

    // aspect 종횡비
    // fov (field of View) : 화각 () 확대를 하고싶으면 fov를 줄이면 된다.
    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      1000
    );

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

    this.geometry = new THREE.BufferGeometry();

    const count = (this.countX + 1) * (this.countY + 1);

    this.props = {
      positions: new Float32Array(count * 3),
      color: new Float32Array(count * 3)
    };

    this.attribute = {
      position: new THREE.BufferAttribute(this.props.positions, 3),
      color: new THREE.BufferAttribute(this.props.color, 3)
    };

    for (let j = 0; j < this.countY + 1; j++) {
      for (let i = 0; i < this.countX + 1; i++) {
        this.props.positions.set(
          [
            i - (this.countX - this.countX / 2),
            j - (this.countY - this.countY / 2),
            1
          ],
          (i + j * (this.countX + 1)) * 3
        );

        const r = (j * (i / this.countX)) / 255;
        const g = (j * (i % this.countX)) / 255;

        this.props.color.set([r, g, 1], (i + j * (this.countX + 1)) * 3);
      }
    }

    const indices: number[] = [];

    for (let i = 0; i < this.countX * this.countY; i++) {
      const std =
        (this.countX + 1) * (Math.floor(i / this.countX) + 1) +
        (i % this.countX);
      indices.push(std);
      indices.push(std + 1);
      indices.push(std - this.countX);
      indices.push(std - this.countX);
      indices.push(std - (this.countX + 1));
      indices.push(std);
    }

    this.geometry.setIndex(indices);

    this.geometry.addAttribute('position', this.attribute.position);
    this.geometry.addAttribute('color', this.attribute.color);

    this.material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.update();

    this.scene.add(this.cube);
    this.camera.position.z = 5;

    document.addEventListener('mousemove', this.onDocumentMouseMove, false);

    this.update();
  }

  private onDocumentMouseMove(e) {
    this.mouse.x = e.clientX - this.width / 2;
    this.mouse.y = e.clientY - this.height / 2;
    this.mouse.z = 40;
  }

  private update() {
    requestAnimationFrame(this.update);
    // 렌더링을 다시 해줘
    // this는 class가 주인인데, 시스템에서 호출할 때는 this가 바껴서 들어와서 this.render를 찾을 수 없는 것.

    this.control.update();
    this.value += 0.03;

    let a = 0;
    for (
      let i = 0;
      i < this.geometry.getAttribute('position').array.length / 3;
      i++
    ) {
      if (i % 20 === 0) {
        a = this.value;
      }
      a += 0.3;

      this.geometry
        .getAttribute('position')
        .setZ(i, Math.sin(a + i * 0.01) * 0.9);

      // 값이 커질수록 물결이 많아짐..왜?

      // 값이 커질수록 범위가 커져서 폭이 커지는 것인가?
    }

    this.attribute.position.needsUpdate = true;
    this.attribute.color.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
