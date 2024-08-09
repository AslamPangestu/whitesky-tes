import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

import styles from "./index.module.css";

import Loader from "../Loader";

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  loading?: boolean;
}

const Button = (props: Props) => {
  return (
    <button
      {...props}
      className={styles.buttonContainer}
      disabled={props.loading || props.disabled}
    >
      {props.loading ? <Loader /> : props.label}
    </button>
  );
};

export default Button;
