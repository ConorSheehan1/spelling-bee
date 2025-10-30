import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

export const InfoFilled: React.FC<IconProps> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor">
    <path d="M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.776 191.232c0-10.752-8.96-19.456-20.096-19.456h-95.36c-11.136 0-20.096 8.704-20.096 19.456v95.36c0 10.752 8.96 19.456 20.096 19.456h95.36c11.136 0 20.096-8.704 20.096-19.456v-95.36zm-92.736 138.944c-19.264 0-35.072 15.552-35.072 35.072v247.104c0 19.264 15.808 35.072 35.072 35.072h65.92c19.264 0 35.072-15.808 35.072-35.072V429.248c0-19.52-15.808-35.072-35.072-35.072h-65.92z" />
  </svg>
);

export const Calendar: React.FC<IconProps> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor">
    <path d="M128 384v512h768V384H128zm685.888-64a32 32 0 0 1 32 32v512a32 32 0 0 1-32 32H210.112a32 32 0 0 1-32-32V352a32 32 0 0 1 32-32h603.776zM320 128h64v128h-64V128zm320 0h64v128h-64V128z" />
  </svg>
);

export const Sunny: React.FC<IconProps> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor">
    <path d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z" />
  </svg>
);

export const Moon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    className={className}
    style={style}
    viewBox="0 0 1024 1024"
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="currentColor">
    <path d="M384 512a448 448 0 0 1 215.872-382.848 384 384 0 0 0-215.872 382.848c0 155.456 92.48 289.472 225.28 349.632A448.384 448.384 0 0 1 384 512z" />
    <path d="M512 1024A512 512 0 1 1 512 0a512 512 0 0 1 0 1024zm0-64a448 448 0 1 0 0-896 448 448 0 0 0 0 896z" />
  </svg>
);
