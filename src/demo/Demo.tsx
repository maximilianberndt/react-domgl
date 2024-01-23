import { Stats } from "@react-three/drei";
import { useLenis } from "@studio-freight/react-lenis";
import { useControls } from "leva";
import React, { useRef } from "react";
import { lerp } from "three/src/math/MathUtils";
import GlElement from "../components/GlElement";
import GlRoot from "../components/GlRoot";
import Background from "./Background";
import Image from "./Image";
import Loader from "./Loader";
import Model from "./Model";
import Object from "./Object";
import Pass from "./Pass";
import Text from "./Text";
import Video from "./Video";
import s from "./demo.module.scss";

const Demo = () => {
  const passRef = useRef();
  const currentVelocity = useRef(0);

  const effectComposerProps = useControls("Post Processing", {
    enabled: true,
  });

  const statsProps = useControls("Stats", {
    enabled: true,
  });

  const postPassProps = useControls("Post Pass", {
    frequency: { value: Math.PI, min: 1, max: 20 },
    amplitude: { value: 0, min: 0, max: 1 },
    blocksStrength: { value: 1 },
    rotation: { value: 0, min: -20, max: 0 },
  });

  const lenis = useLenis(({ velocity }) => {
    currentVelocity.current = lerp(currentVelocity.current, velocity, 0.1);

    if (!passRef.current) return;
    const v = currentVelocity.current;
    passRef.current.uniforms.get("amplitude").value = v * -0.006;

    // passRef.current.uniforms.get('blocksStrength').value = Math.abs(
    //   window.innerHeight - velocity * 1000
    // )

    // console.log(passRef.current.uniforms.get('blocksStrength').value)
  });

  return (
    <>
      <GlRoot
        passes={[<Pass key={1} ref={passRef} {...postPassProps} />]}
        effectComposerProps={effectComposerProps}
      >
        {statsProps.enabled && <Stats />}

        <GlElement>
          <Background />
        </GlElement>

        <GlElement>
          <Object />
        </GlElement>

        <div className={s.grid}>
          <Text
            className={s.copy}
            style={{
              position: "absolute",
              top: "17vw",
              right: "10vw",
              whiteSpace: "nowrap",
            }}
          >
            Just scroll and you will see
          </Text>

          <Text className={s.headline} as="h1">
            Hello -
          </Text>
          <Text
            className={s.headline}
            style={{
              alignSelf: "flex-end",
              marginTop: "-2%",
            }}
          >
            What is this?
          </Text>

          <Text className={s.copy}>
            I call this technique DomGl because it allows you to mix WebGl with
            regular dom elements. We can copy the position and size of elements
            and perfectly recreate them in the WebGL world. This allows to add
            fancy effects to any element. Notice the fancy fade in animation,
            how the text is reflected in the cube and how the site bends during
            scroll. All of this would not be possible without WebGL.
          </Text>

          <div className={s.imageGrid}>
            <Image
              src={"/test.png"}
              style={{
                aspectRatio: "1 / 1",
              }}
            />

            <Video
              src={"/test.mp4"}
              style={{ width: "40vw", aspectRatio: "16 / 9" }}
            />
          </div>

          <Text className={s.copy}>
            Also we can seamlessly integrate 3d models:
          </Text>

          <Model src="ym.glb" />

          <Text className={s.copy}>
            I just have limited time creating this but this allows us to build
            stuff like:
          </Text>

          {[
            { copy: "Lusion", link: "https://lusion.co/" },
            { copy: "Pluto", link: "https://www.pluto.app/" },
            {
              copy: "14 Islands",
              link: "https://www.14islands.com/",
            },
            { copy: "Gleec", link: "https://gleec.com/" },
          ].map(({ copy, link }) => (
            <Text
              key={link}
              className={s.headline}
              as="a"
              href={link}
              target="_blank"
            >
              {copy}
            </Text>
          ))}

          <div className={s.footer}>
            <Text className={s.copy}>
              The good thing is that we can apply this effect to only the
              elements that we want. For example This button is just html + css.
              But we could aslo recreate it in WebGl and then it could have the
              same animation as the iamges. Or a different one. The
              possibilities are endless.
            </Text>

            <button
              className={s.button}
              onClick={() =>
                lenis.scrollTo(0, {
                  duration: 2,
                  easing: (x) =>
                    x < 0.5
                      ? 8 * x * x * x * x
                      : 1 - Math.pow(-2 * x + 2, 4) / 2,
                })
              }
            >
              <span className={s.headline}>Scroll to top</span>
            </button>
          </div>
        </div>
      </GlRoot>

      <Loader />
    </>
  );
};

export default Demo;
