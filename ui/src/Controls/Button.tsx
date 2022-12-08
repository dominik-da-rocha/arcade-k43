import React from "react";
import "./Button.css";

export function Button(
  props: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) {
  return <button {...props} className={props.className + " Button"}></button>;
}

