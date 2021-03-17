sap.ui.define([
    "renovRetail/OverviewOrdemFrete/overviewordemfrete/controller/BaseController",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("renovRetail.OverviewOrdemFrete.overviewordemfrete.controller.Detail", {

            onInit: function () {
                this.oRouter = this.getRouter();

                this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched, this);
                // this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched, this);
                // var oVBI = this.getView().byId("GeoMap");
                // var conf = {
                //     "MapProvider": [
                //         {
                //             "Id": "OSM",
                //             "name": "Open Street Map",
                //             "tileX": "256",
                //             "tileY": "256",
                //             "minLOD": "1",
                //             "maxLOD": "19",
                //             "copyright": "OpenStreetMap",
                //             "Source": [{
                //                 "id": "a",
                //                 "url": "https://a.tile.openstreetmap.org/{LOD}/{X}/{Y}.png"
                //             }]
                //         }
                //     ],
                //     "MapLayerStacks":
                //         [
                //             {
                //                 "name": "Default",
                //                 "MapLayer": [
                //                     {
                //                         "name": "Default",
                //                         "refMapProvider": "Open Street Map",
                //                         "opacity": "1.0",
                //                         "colBkgnd": "RGB(255,255,255)"
                //                     }
                //                 ]
                //             }
                //         ]
                // };
                // oVBI.setMapConfiguration(conf);
            },

            _onProductMatched: function (oEvent) {
                this._CodigoInt = oEvent.getParameter("arguments").CodigoInt || this._CodigoInt || "0";
                this.getView().bindElement({
                    path: "/" + this._CodigoInt
                });
            }
        });
    });