import React, { memo, Suspense } from "react";

import { BrowserRouter } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import routes from "@/router";

export default memo(function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>page Loading</div>}>
        {renderRoutes(routes)}
      </Suspense>
    </BrowserRouter>
  );
});
