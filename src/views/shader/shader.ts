import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferAttribute, Vector2, Vector3 } from 'three';

// @ts-ignore
import vs from '!!raw-loader!./default.vert';
// @ts-ignore
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
  private a = 1.0;

  private countX = 50;
  private countY = 50;

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
        time: { value: this.tick },
        random: { value: 1.0 }
      },
      vertexShader: vs,
      fragmentShader: fs,
      side: THREE.DoubleSide,
      transparent: true
    });

    const count = (this.countX + 1) * (this.countY + 1);

    this.props = {
      positions: new Float32Array(count * 18),
      color: new Float32Array(count * 4 * 6)
    };

    this.attribute = {
      position: new THREE.BufferAttribute(this.props.positions, 3),
      color: new THREE.BufferAttribute(this.props.color, 4)
    };

    const offsets: number[] = [];
    let vector = new THREE.Vector4();
    var orientationsStart: number[] = [];
    var orientationsEnd: number[] = [];

    for (let j = 0; j < this.countY; j++) {
      for (let i = 0; i < this.countX; i++) {
        this.props.positions.set(
          [
            Math.random() + i - (this.countX - this.countX / 2),
            Math.random() + j - (this.countY - this.countY / 2),
            Math.random() * 10 - 5,
            Math.random() + i - (this.countX - this.countX / 2),
            Math.random() + j + 1 - (this.countY - this.countY / 2),
            Math.random() * 10 - 5,
            Math.random() + i + 1 - (this.countX - this.countX / 2),
            Math.random() + j - (this.countY - this.countY / 2),
            Math.random() * 10 - 5,
            Math.random() + i + 1 - (this.countX - this.countX / 2),
            Math.random() + j - (this.countY - this.countY / 2),
            Math.random() * 10 - 5,
            Math.random() + i - (this.countX - this.countX / 2),
            Math.random() + j + 1 - (this.countY - this.countY / 2),
            Math.random() * 10 - 5,
            Math.random() + i + 1 - (this.countX - this.countX / 2),
            Math.random() + j + 1 - (this.countY - this.countY / 2),
            Math.random() * 10 - 5
          ],
          (i + j * this.countX) * 18
        );

        offsets.push(
          Math.random() - 0.5,
          Math.random() - 0.5,
          Math.random() - 0.5
        );
        const r = (j + Math.random() + 0.3) * (i / this.countX) * 0.3;
        const g = (j + Math.random() + 0.3) * (i % this.countX) * 0.5;

        this.props.color.set([r, g, 1, 1.0], (i + j * (this.countX + 1)) * 4);
        this.props.color.set(
          [r, g, 0.5, 1.0],
          (i + (j + 1) * (this.countX + 1)) * 4
        );
        this.props.color.set(
          [r, g, 0.5, 1.0],
          (i + 1 + j * (this.countX + 1)) * 4
        );
        this.props.color.set(
          [r, g, 0.5, 1.0],
          (i + 1 + j * (this.countX + 1)) * 4
        );
        this.props.color.set(
          [r, g, 0.5, 1.0],
          (i + (j + 1) * (this.countX + 1)) * 4
        );

        this.props.color.set(
          [r, g, 0.5, 1.0],
          (i + 1 + (j + 1) * (this.countX + 1)) * 4
        );
      }
    }

    for (let i = 0; i < count * 24; i++) {
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();
      orientationsStart.push(vector.x, vector.y, vector.z, vector.w);
      // orientation end
      vector.set(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      );
      vector.normalize();
      orientationsEnd.push(vector.x, vector.y, vector.z, vector.w);
    }

    this.geometry.addAttribute('position', this.attribute.position);

    this.geometry.addAttribute(
      'offset',
      new THREE.InstancedBufferAttribute(new Float32Array(offsets), 3)
    );

    this.geometry.addAttribute(
      'orientationStart',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsStart), 4)
    );
    this.geometry.addAttribute(
      'orientationEnd',
      new THREE.InstancedBufferAttribute(new Float32Array(orientationsEnd), 4)
    );
    // this.geometry.addAttribute('color', this.attribute.color);

    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.update();

    this.scene.add(this.cube);
    this.camera.position.z = 100;

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

    // this.a = -this.a;

    (this.material as THREE.RawShaderMaterial).uniforms.random = {
      value: Math.sin(this.tick * 0.05)
    };

    if (this.tick > 5) {
      this.tick = 0;
    } else {
      this.tick += 0.03;
    }

    this.attribute.position.needsUpdate = true;
    this.attribute.color.needsUpdate = true;

    this.renderer.render(this.scene, this.camera);
  }
}
