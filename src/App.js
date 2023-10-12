import { useState,  } from "react";

import { Particle } from "./helpers/particles";

function App() {
  const listSong = [{ url: "/song/1.m4a", text: "файл 1" }, { url: "/song/2.m4a", text: "файл 2" }, { url: "/song/3.m4a", text: "файл 3" }, { url: "/song/4.m4a", text: "файл 4" }]
  const listTextures = [{ url: "/textures/ellipse.svg", class: "ellipse", text: "Эллипс" }, { url: "/textures/star.svg", class: "star", text: "Звезда" }]
  let [isPlay, setIsPlay] = useState(false)
  let [texture, setTexture] = useState('Ellipse.svg')
  let [vr_enable, set_vr_enable] = useState(false)

  function play(song) {
    if (!isPlay) {

      const particle = new Particle(window, vr_enable)
      particle.createCamera(window)
      particle.createListener(song)
      console.log(texture);
      particle.createParticles(texture)
      particle.animate()
      setIsPlay(true)
    }
  }
  if (!isPlay) {
    return (
      <div style={isPlay ? { height: "0px", width: "0px" } : null} className="side" >
        <div className="player">
          <h1 className="title">STEP Play</h1>
          {listSong.map((el, index) => {
            return (
              <div key={index} className="item">
                <div className="info">
                  <img src="/image/song.png" alt="ttt" />
                  <h2>{el.text}</h2>
                </div>
                <button className="button-54" onClick={() => { play(el.url) }} >start</button>
              </div>
            )
          })}

          <div className="radio__list">
            {listTextures.map((el, index) => {
              return (
                <p key={index} className="radio_item ">
                  <input type="radio" id={"test" + index} onChange={() => { setTexture(el.url) }} value={el.url} name="radio-group" hidden />
                  <label htmlFor={"test" + index} className={el.class}>{el.text}</label>
                </p>
              )
            })}
            <div className="radiogroup">
              <div className="wrapper">
                <input className="state" type="radio" onChange={() => { set_vr_enable(true) }} value={true} name="app" id="useVR" />
                <label className="label" htmlFor="useVR">
                  <div className="indicator"></div>
                  <span className="text">использовать&nbsp;VR</span>
                </label>
              </div>
              <div className="wrapper">
                <input className="state" type="radio" name="app" onChange={() => { set_vr_enable(false) }} value={false} id="dontUse" />
                <label className="label" htmlFor="dontUse">
                  <div className="indicator"></div>
                  <span className="text">не&nbsp;использовать</span>
                </label>
              </div>
            </div>


          </div>
        </div>
      </div >
    );
  }
  else {
    return (
      <button onClick={()=>{  window.location.reload(); }} className="button-54" style={{ position: "fixed", zIndex: "300", left: "0", top: "0" }}>stop</button>
    )
  }
}

export default App;
