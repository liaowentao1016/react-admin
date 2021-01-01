import React, { memo } from "react";

import { renderRoutes } from "react-router-config";

export default memo(function LQGoods(props) {
  return <>{renderRoutes(props.route.routes)}</>;
});
