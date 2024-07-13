import React from "react";
import {
  Verified,
  CheckCircle,
  Cancel,
  Male,
  Female,
} from "@mui/icons-material";
import MapsHomeWorkRoundedIcon from "@mui/icons-material/MapsHomeWorkRounded";
import { motion } from "framer-motion";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import "../styles/widget.css";

const Widget = React.memo(
  ({ type, count, total, completedTotal, genderCounts }) => {
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
              backgroundColor: "rgba(0, 128, 0, 0.2)",
              color: "green",
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
          <LightModeRoundedIcon
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
          <MapsHomeWorkRoundedIcon
            className="icon"
            style={{
              color: "blue",
              backgroundColor: "rgba(0, 0, 255, 0.2)",
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
          <div className="gender-breakdown">
            <span>Male: {genderCounts.male}</span>
            <span>Female: {genderCounts.female}</span>
          </div>
          <div style={{ fontSize: "small" }}></div>
        </div>
        <div className="right">
          <span style={{ fontSize: "small" }}>{`${diff}%`}</span>
          {data.icon}
        </div>
      </motion.div>
    );
  }
);

export default Widget;
