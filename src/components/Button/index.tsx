import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import styles from "./index.module.css";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
}

const Button = (props: Props) => {
  return (
    <button {...props} className={styles.buttonContainer}>
      {props.label}
    </button>
  );
};

export default Button;
