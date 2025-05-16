import { Button } from "@/components/ui/button";
import React from "react";

const Newbutton = ({ text = "button" }) => {
  return <Button className="bg-red-400">{text}</Button>;
};

export default Newbutton;
