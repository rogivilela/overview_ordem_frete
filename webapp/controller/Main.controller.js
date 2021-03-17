sap.ui.define([
	"renovRetail/OverviewOrdemFrete/overviewordemfrete/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/m/DatePicker",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, JSONModel, DatePicker, Filter, FilterOperator) {
		"use strict";

		return Controller.extend("renovRetail.OverviewOrdemFrete.overviewordemfrete.controller.Main", {
			mandatoryChart: null,
			onInit: function () {
				this.oViewModel = new JSONModel({
					Werks: null,
					Date: null,
					Date2: null,
				});
				this.oDonutChart = this.getView().byId("donut-chart");
				this.oDonutChartFat = this.getView().byId("donut-chart-fat");
				this.oColumnChart = this.getView().byId("column-chart");

				this.setModel(this.oViewModel, "viewModel");
				this.getOwnerComponent().getModel().attachRequestCompleted(this.onFinishReadOData, this);
				this.oDonutChart.attachSelectData(this.getSelectDataFromDonutChart, this);
				this.oDonutChart.attachDeselectData(this.getDeselectDataFromDonutChart, this);
				this.oColumnChart.attachSelectData(this.getSelectDataFromColumnChart, this);
				this.oColumnChart.attachDeselectData(this.getDeselectDataFromColumnChart, this);
				this.oDonutChart.setBusy(true);
				this.oDonutChartFat.setBusy(true);
				this.oColumnChart.setBusy(true);
			},
			handleSelectionFinish: function (oEvent) {
				var aFilter = [];
				var aSlectedItems = this.getModel("viewModel").getData().Werks;
				var oDonutChart = this.getView().byId("donut-chart");
				var oDonutChartFat = this.getView().byId("donut-chart-fat");
				var oColumnChart = this.getView().byId("column-chart");
				if (aSlectedItems != null) {
					for (var i = 0; i < aSlectedItems.length; i++) {
						aFilter.push(new Filter("Werks", FilterOperator.EQ, aSlectedItems[i]));
					}
				}
				if (this.getModel("viewModel").getData().Date != null) {
					if (this.getModel("viewModel").getData().Date2 == null) {
						aFilter.push(new Filter("Data", FilterOperator.EQ, this.getModel("viewModel").getData().Date));
					}
					else {
						aFilter.push(new Filter("Data", FilterOperator.BT, this.getModel("viewModel").getData().Date, this.getModel("viewModel").getData().Date2));
					}
				}
				oDonutChart.getDataset().getBinding("data").filter(aFilter)
				oDonutChartFat.getDataset().getBinding("data").filter(aFilter)
				oColumnChart.getDataset().getBinding("data").filter(aFilter)

				this.getView().byId("table").getBinding("items").filter(aFilter);
				oDonutChart.setBusy(true);
				oDonutChartFat.setBusy(true);
				oColumnChart.setBusy(true);
				this.mandatoryChart = "";
			},
			handleDateChange: function (oEvent) {
				var aFilter = [];
				var aSlectedItems = this.getModel("viewModel").getData().Werks;
				var oDonutChart = this.getView().byId("donut-chart");
				var oDonutChartFat = this.getView().byId("donut-chart-fat");
				var oColumnChart = this.getView().byId("column-chart");
				var oTable = this.getView().byId("table");
				if (aSlectedItems != null) {
					for (var i = 0; i < aSlectedItems.length; i++) {
						aFilter.push(new Filter("Werks", FilterOperator.EQ, aSlectedItems[i]));
					}
				}
				if (this.getModel("viewModel").getData().Date != null) {
					if (this.getModel("viewModel").getData().Date2 == null) {
						aFilter.push(new Filter("Data", FilterOperator.EQ, this.getModel("viewModel").getData().Date));
					}
					else {
						aFilter.push(new Filter("Data", FilterOperator.BT, this.getModel("viewModel").getData().Date, this.getModel("viewModel").getData().Date2));
					}
				}
				oDonutChart.getDataset().getBinding("data").filter(aFilter)
				oDonutChartFat.getDataset().getBinding("data").filter(aFilter)
				oColumnChart.getDataset().getBinding("data").filter(aFilter)
				oTable.getBinding("items").filter(aFilter);
				oDonutChart.setBusy(true);
				oDonutChartFat.setBusy(true);
				oColumnChart.setBusy(true);
				this.mandatoryChart = "";
			},
			convertToFloat: function (sNum) {

				return parseFloat(sNum)
			},
			onFinishReadOData: function (that) {
				var oDonutChart = this.getView().byId("donut-chart");
				var oDonutChartFat = this.getView().byId("donut-chart-fat");
				var oColumnChart = this.getView().byId("column-chart");
				oDonutChart.setBusy(false);
				oDonutChartFat.setBusy(false);
				oColumnChart.setBusy(false);
			},
			onDocumentPress: function (oEvent) {
				var codigoIntPath = oEvent.getSource().getBindingContext().getPath(),
					codigoInt = codigoIntPath.split("/").slice(-1).pop();

				this.getRouter().navTo("detail", { CodigoInt: codigoInt });
			},
			getSelectDataFromDonutChart: function (oEvent) {
				if (this.oColumnChart.vizSelection().length === 0) {
					this.mandatoryChart = "DonutChart";
				}
				this._getActualSelectedDataFromChart(oEvent);

			},
			getDeselectDataFromDonutChart: function (oEvent) {
				this._getActualSelectedDataFromChart(oEvent);
				if (this.mandatoryChart === "DonutChart" &&
					this.oDonutChart.vizSelection().length === 0) {
					this.mandatoryChart = "";
				}
			},
			_getActualSelectedDataFromChart: function (oEvent) {
				var oTable = this.getView().byId("table");
				var aSlectedItems = this.getModel("viewModel").getData().Werks;
				var aVizSelection = oEvent.getSource().vizSelection(),
					aFilter = [],
					aFilterColum = [];

				aFilter = this._getItensFromDonutChart(aVizSelection);
				aFilterColum = this._getItensFromColumChart(this.oColumnChart.vizSelection());
				for (var i = 0; i < aFilterColum.length; i++) {
					aFilter.push(aFilterColum[i]);
				}
				if (this.getModel("viewModel").getData().Date != null) {
					if (this.getModel("viewModel").getData().Date2 == null) {
						aFilter.push(new Filter("Data", FilterOperator.EQ, this.getModel("viewModel").getData().Date));
					}
					else if (this.getModel("viewModel").getData().Date2 != null) {
						aFilter.push(new Filter("Data", FilterOperator.BT, this.getModel("viewModel").getData().Date, this.getModel("viewModel").getData().Date2));
					}
				}
				if (aSlectedItems != null) {
					for (var i = 0; i < aSlectedItems.length; i++) {
						aFilter.push(new Filter("Werks", FilterOperator.EQ, aSlectedItems[i]));
					}
				}
				oTable.getBinding("items").filter(aFilter);
				if (this.mandatoryChart === "DonutChart") {
					this.oColumnChart.getDataset().getBinding("data").filter(aFilter);
					this.oColumnChart.setBusy(true);
				}
			},
			getSelectDataFromColumnChart: function (oEvent) {
				if (this.oDonutChart.vizSelection().length === 0) {
					this.mandatoryChart = "ColumnChart";
				}
				this._getActualSelectedDataFromColumnChart(oEvent);

			},
			getDeselectDataFromColumnChart: function (oEvent) {

				this._getActualSelectedDataFromColumnChart(oEvent);
				if (this.mandatoryChart === "ColumnChart" &&
					this.oColumnChart.vizSelection().length === 0) {
					this.mandatoryChart = "";
				}

			},
			_getActualSelectedDataFromColumnChart: function (oEvent) {
				var oTable = this.getView().byId("table");
				var aSlectedItems = this.getModel("viewModel").getData().Werks;
				var aVizSelection = oEvent.getSource().vizSelection(),
					qtdDif = 0,
					aFilter = [],
					aFilterDonut = [];
				aFilter = this._getItensFromColumChart(aVizSelection);
				aFilterDonut = this._getItensFromDonutChart(this.oDonutChart.vizSelection())

				if (this.getModel("viewModel").getData().Date != null) {
					if (this.getModel("viewModel").getData().Date2 == null) {
						aFilter.push(new Filter("Data", FilterOperator.EQ, this.getModel("viewModel").getData().Date));
					}
					else if (this.getModel("viewModel").getData().Date2 != null) {
						aFilter.push(new Filter("Data", FilterOperator.BT, this.getModel("viewModel").getData().Date, this.getModel("viewModel").getData().Date2));
					}
				}
				if (aSlectedItems != null) {
					for (var i = 0; i < aSlectedItems.length; i++) {
						aFilter.push(new Filter("Werks", FilterOperator.EQ, aSlectedItems[i]));
					}
				}
				oTable.getBinding("items").filter(aFilter);
				if (this.mandatoryChart === "ColumnChart") {
					this.oDonutChart.getDataset().getBinding("data").filter(aFilter);
					this.oDonutChart.setBusy(true);
				}
			},
			_getItensFromColumChart: function (aList) {
				var aFilter = [],
					qtdDif = 0;
				for (var i = 0; i < aList.length; i++) {
					if (aList[i].data.Descricao == 'Sem Diferença') {
						qtdDif = 0;
					}
					else {
						qtdDif = aList[i].data.Descricao.substr(-1, 1);
					}
					aFilter.push(new Filter("DifQtdRem", FilterOperator.EQ, qtdDif));
				}
				return aFilter;
			},
			_getItensFromDonutChart: function (aList) {
				var aFilter = [];
				var sStatusFinal = "";
				for (var i = 0; i < aList.length; i++) {
					switch (aList[i].data.Descricao) {
						case 'Documento Criado e Transmitido':
							sStatusFinal = 'SS';
							break;
						case 'Documento Criado, Falta Transmitir':
							sStatusFinal = 'S';
							break;
						case 'Com Erro':
							sStatusFinal = 'E';
							break;
						case 'Aguardando Criação':
							sStatusFinal = 'W';
							break;
						case 'Cancelada e transmitido':
							sStatusFinal = 'CS';
							break;
						case 'Cancelada, Falta Transmitir':
							sStatusFinal = 'C';
							break;
						default:
							break;
					}
					aFilter.push(new Filter("StatusFinal", FilterOperator.EQ, sStatusFinal));
				}
				return aFilter;
			}
		});
	});
