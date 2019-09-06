import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferAttribute, Vector2, Vector3 } from 'three';

//@ts-ignore
import vs from '!!raw-loader!./default.vert';
//@ts-ignore
import fs from '!!raw-loader!./default.frag';

interface SampleAttributes {
  position: THREE.BufferAttribute;
  color: THREE.BufferAttribute;
}

interface SampleProps {
  positions: Float32Array;
  color: Float32Array;
}

@Component({})
export default class Shader extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;

  private geometry!: THREE.BufferGeometry;
  private material!: THREE.Material;
  private attribute!: SampleAttributes;
  private props!: SampleProps;

  private cube!: THREE.Mesh;
  private value: number = 0;
  private control!: OrbitControls;
  private mouse = new Vector3();
  private tick = 0;

  private countX = 20;
  private countY = 20;

  private width = 0;
  private height = 0;

  private mounted() {
    this.width = this.$refs.renderer.clientWidth;
    this.height = this.$refs.renderer.clientHeight;

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.width / this.height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize(
      this.$refs.renderer.clientWidth,
      this.$refs.renderer.clientHeight
    );

    this.$refs.renderer.appendChild(this.renderer.domElement);

    this.geometry = new THREE.BufferGeometry();

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        time: { value: this.tick }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true
    });

    const count = (this.countX + 1) * (this.countY + 1);

    this.props = {
      positions: new Float32Array(count * 18),
      color: new Float32Array(count * 3)
    };

    this.attribute = {
      position: new THREE.BufferAttribute(this.props.positions, 3),
      color: new THREE.BufferAttribute(this.props.color, 3)
    };

    for (let j = 0; j < this.countY; j++) {
      for (let i = 0; i < this.countX; i++) {
        this.props.positions.set(
          [
            i - (this.countX - this.countX / 2),
            j - (this.countY - this.countY / 2),
            1,
            i - (this.countX - this.countX / 2),
            j + 1 - (this.countY - this.countY / 2),
            1,
            i + 1 - (this.countX - this.countX / 2),
            j - (this.countY - this.countY / 2),
            1,
            i + 1 - (this.countX - this.countX / 2),
            j - (this.countY - this.countY / 2),
            1,
            i - (this.countX - this.countX / 2),
            j + 1 - (this.countY - this.countY / 2),
            1,
            i + 1 - (this.countX - this.countX / 2),
            j + 1 - (this.countY - this.countY / 2),
            1
          ],
          (i + j * this.countX) * 18
        );
      }
    }

    this.geometry.addAttribute('position', this.attribute.position);
    // this.geometry.addAttribute('color', this.attribute.color);

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

    (this.material as THREE.RawShaderMaterial).uniforms.time = {
      value: this.tick
    };

    this.tick += 0.03;

    this.attribute.position.needsUpdate = true;
    this.attribute.color.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
