import React from "react";
import { Verified, CheckCircle, Cancel } from "@mui/icons-material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/widget.css";

const Widget = React.memo(({ type, count, total, completedTotal }) => {
  const widgetData = {
    total: {
      title: "TOTAL STUDENTS",
      link: "/admin/dashboard/placement-actions",
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
      link: "/admin/dashboard/manage-student",
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
    completedTotal: {
      title: "COMPLETED STUDENTS",
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
    day: {
      title: "DAY STUDENTS",
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
    boarding: {
      title: "BOARDING STUDENTS",
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
  let diff;

  if (type === "day" || type === "boarding") {
    diff = completedTotal ? Math.round((count / completedTotal) * 100) : 0;
  } else {
    diff = total ? Math.round((count / total) * 100) : 100;
  }

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
        <Link
          to={data.link}
          style={{ textDecoration: "underline", fontSize: "small" }}
        >
          {"see all"}
        </Link>
      </div>
      <div className="right">
        <span style={{ fontSize: "small" }}>{`${diff}%`}</span>
        {data.icon}
      </div>
    </motion.div>
  );
});

export default Widget;
