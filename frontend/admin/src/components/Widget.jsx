import React from "react";
import { Verified, CheckCircle, Cancel } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/widget.css"

const Widget = React.memo(({ type, count }) => {
  const widgetData = {
    total: {
      title: "TOTAL STUDENTS",
      diff: 100,
      icon: (
        <Verified
          className="icon"
          style={{
            backgroundColor: "rgba(0, 128, 0, 0.2)",
            color: "green",
          }}
        />
      ),
    },
    completed: {
      title: "COMPLETED STUDENTS",
      diff: 20,
      icon: (
        <CheckCircle
          className="icon"
          style={{
            backgroundColor: "rgba(218, 165, 32, 0.2)",
            color: "goldenrod",
          }}
        />
      ),
    },
    incomplete: {
      title: "INCOMPLETE STUDENTS",
      diff: 80,
      icon: (
        <Cancel
          className="icon"
          style={{
            color: "crimson",
            backgroundColor: "rgba(255, 0, 0, 0.2)",
          }}
        />
      ),
    },
  };

  const data = widgetData[type];

  return (
    <motion.div
      className="widget"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="pop">{count}</span>
        <Link to="#">{"see all"}</Link>
      </div>
      <div className="right">
        {`${data.diff}%`}
        {data.icon}
      </div>
    </motion.div>
  );
});

export default Widget;
