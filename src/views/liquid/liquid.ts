import { Vue, Component } from 'vue-property-decorator';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BufferAttribute, Vector2, Vector3, TetrahedronGeometry } from 'three';

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
export default class Liquid extends Vue {
  public $refs!: {
    renderer: HTMLElement;
  };

  private scene: THREE.Scene = new THREE.Scene();
  private camera!: THREE.Camera;
  private renderer!: THREE.WebGLRenderer;

  private geometry!: THREE.PlaneGeometry;
  private material!: THREE.Material;
  private attribute!: SampleAttributes;
  private props!: SampleProps;

  private cube!: THREE.Mesh;
  private value: number = 0;
  private control!: OrbitControls;
  private mouse = new Vector3();
  private tick = 0;

  private countX = 1;
  private countY = 1;

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

    this.geometry = new THREE.PlaneGeometry(5, 5);

    const texture1 = new THREE.TextureLoader().load(
      'https://pbs.twimg.com/media/DVSAm8CVQAAQJ9i.jpg'
    );
    const texture2 = new THREE.TextureLoader().load('/normalmap.jpg');
    texture1.wrapS = THREE.RepeatWrapping;
    texture1.wrapT = THREE.RepeatWrapping;

    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;

    this.material = new THREE.RawShaderMaterial({
      uniforms: {
        texture1: {
          type: 't',
          value: texture1
        },
        texture2: {
          type: 't',
          value: texture2
        },
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

    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.update();

    this.scene.add(this.cube);
    this.camera.position.z = 5;

    this.update();
  }

  private update() {
    requestAnimationFrame(this.update);

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
