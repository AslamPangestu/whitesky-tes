import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styles from "./index.module.css";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label: string;
}

const Input = (props: Props) => {
  return (
    <div className={styles.inputGroup}>
      <label>{props.label}</label>
      <input {...props} />
    </div>
  );
};

export default Input;
