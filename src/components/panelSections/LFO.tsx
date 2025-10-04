import SwitchContainer from "@/components/controlGroups/SwitchContainer";
import Knob from "@/components/controlGroups/Knob";
import InvertToggle from "@/components/controlGroups/InvertToggle";
import Triangle from "../assets/Triangle";
import Saw from "../assets/Saw";
import Square from "../assets/Square";
import Noise from "../assets/Noise";

interface LFOProps {
  wave: number;
  mode: number;
  rate: number;
  intensity: number;
  target: number;
  onChangeWave: (value: number) => void;
  onChangeMode: (value: number) => void;
  onChangeRate: (value: number) => void;
  onChangeIntensity: (value: number) => void;
  onChangeTarget: (value: number) => void;
  onIntensityInvertChange?: (isInverted: boolean) => void;
}

export const LFO = (props: LFOProps) => {
  return (
    <div className="panel-group">
      <h2 className="panel-group-label label">LFO</h2>
      <SwitchContainer paramName="Wave" value={props.wave} onChange={props.onChangeWave} />
      <SwitchContainer
        paramName="Mode"
        value={props.mode}
        onChange={props.onChangeMode}
        labels={[<div key="fast">Fast</div>, <div key="slow">Slow</div>, <div key="1shot">1Shot</div>]}
      />
      <Knob color="green" paramName="Rate" value={props.rate} onChange={props.onChangeRate} />
      <div className="control-group">
        <Knob
          color="green"
          paramName="Int"
          fullParamName="lfo.intensity"
          value={props.intensity}
          onChange={props.onChangeIntensity}
          invertible={true}
          invertedColor="yellow"
          testId="lfo-int-knob"
        />
        <InvertToggle
          paramName="Int"
          isInverted={props.intensity < 0}
          onToggle={() => props.onIntensityInvertChange && props.onIntensityInvertChange(props.intensity >= 0)}
          invertedColor="yellow"
          testId="lfo-int-toggle"
        />
      </div>
      <SwitchContainer
        paramName="Target"
        value={props.target}
        onChange={props.onChangeTarget}
        labels={[<div key="pitch">Pitch</div>, <div key="shape">Shape</div>, <div key="cutoff">Cutoff</div>]}
      />
    </div>
  );
};
