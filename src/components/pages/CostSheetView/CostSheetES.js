import React, { useEffect, useState } from "react";
import { generateCostSheetDisplay } from "./CostSheetDS";
import config from "./CostSheetCS";
import API from "../../../api/API";
import * as XLSX from "xlsx";

const CostSheetView = () => {
  let [rendered, setRendered] = useState(true);
  let [costSheetData, setCostSheetData] = useState(null);
  let [expandedGroups, setExpandedGroups] = useState({});

  function reRender() {
    setRendered(!rendered);
  }

  function toggleGroup(category) {
    setExpandedGroups((prev) => ({
      ...prev,
      [category]: prev[category] === false ? true : false,
    }));
  }

  /*********************************************************/
  /********      Framework Action Definitions     **********/
  /*********************************************************/

  config["CONTROL_CENTER"].renderFunction = reRender;
  config["buttonAdvanceSearch"].event.onClick = handleAdvanceSearchPopup;
  config["buttonExcel"].event.onClick = handleExportExcel;
  config["CONTROL_CENTER"].event.onAdvanceSearch = handleAdvanceSearch;
  config["CONTROL_CENTER"].event.onAdvanceSearchDone = handleAdvanceSearchDone;

  /*********************************************************/
  /********       Framework Action Handlers       **********/
  /*********************************************************/

  /*********************************************************/
  /********       User Defined Declarations       **********/
  /*********************************************************/

  useEffect(() => {
    __setFormReadWrite(true);
  }, []);

  function __checkIsAuthorized() {
    const apiRequest = { screen: "CostSheet" };
    API.post(`permissions/isAuthorized`, apiRequest)
      .then((response) => {
        __setFormReadWrite(response.data);
      })
      .catch(() => {
        __setFormReadWrite("r");
      });
  }

  function __setFormReadWrite(status) {
    // View-only screen — no write controls to toggle
  }

  // Enable navigation prompt
  window.onbeforeunload = function () {
    if (
      config["CONTROL_CENTER"].state.modified ||
      config["CONTROL_CENTER"].state.new ||
      config["CONTROL_CENTER"].state.deleted
    ) {
      return true;
    }
  };

  /*********************************************************/
  /********        User Defined Functions         **********/
  /*********************************************************/

  function handleError(error) {
    try {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        try {
          const errorData =
            typeof error.response.data.message === "string"
              ? JSON.parse(error.response.data.message)
              : error.response.data.message;
          const errors = [];
          Object.entries(errorData).forEach(([, data]) => {
            if (Array.isArray(data)) data.forEach((e) => errors.push(e));
            else errors.push(data);
          });
          config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
          return;
        } catch {
          config["CONTROL_CENTER"].promptErrorMessage(
            "Error",
            error.response.data.message ||
            "Please Contact System Administrator",
          );
          return;
        }
      }
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = [];
        Object.entries(error.response.data.errors).forEach(([, messages]) => {
          messages.forEach((m) => errors.push(m));
        });
        config["CONTROL_CENTER"].promptWarningMessage(errors[0], "");
        return;
      }
    } catch (err) {
      console.log(err);
    }
    config["CONTROL_CENTER"].promptErrorMessage(
      "Error",
      "Please Contact System Administrator",
    );
  }

  //////////////////////////////////////////////////////////////////////
  //                      ADVANCE SEARCH APIs                         //
  //////////////////////////////////////////////////////////////////////

  async function handleExportExcel() {
    if (!costSheetData) return;

    const wb = XLSX.utils.book_new();

    // ── Build single sheet data ───────────────────────────────────
    const wsData = [
      ["Batch No", costSheetData.batch_no || "–"],
      ["Main Model", costSheetData.main_model_name || "–"],
      ["Model", costSheetData.model_name || "–"],
      ["Total Qty", costSheetData.total_qty],
      ["Total Material Cost", costSheetData.total_material_cost],
      [], // blank separator
      ["Category", "Material Code", "Material Name", "Req. Qty", "Consumption", "Issued Qty", "Actual Consumption", "Unit Cost", "Total Req. Cost", "Total Issued Cost"],
    ];

    (costSheetData.material_groups || []).forEach((group) => {
      (group.items || []).forEach((item) => {
        wsData.push([
          group.category,
          item.material_code,
          item.material_name,
          item.required_qty,
          item.consumption,
          item.issued_qty,
          item.actual_consumption,
          item.unit_cost,
          item.total_required_cost,
          item.total_issued_cost,
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // ── Column widths ─────────────────────────────────────────────
    ws["!cols"] = [
      { wch: 22 }, // A: Category / label
      { wch: 16 }, // B: Material Code
      { wch: 28 }, // C: Material Name
      { wch: 12 }, // D: Req. Qty
      { wch: 12 }, // E: Issued Qty
      { wch: 12 }, // E: Consumption
      { wch: 12 }, // F: Issued Qty
      { wch: 18 }, // G: Actual Consumption
      { wch: 15 }, // H: Unit Cost
      { wch: 18 }, // G: Total Req. Cost
      { wch: 18 }, // H: Total Issued Cost
    ];

    // ── Style info label cells (A1:A5) ────────────────────────────
    ["A1", "A2", "A3", "A4", "A5"].forEach((ref) => {
      if (ws[ref]) {
        ws[ref].s = {
          font: { bold: true, sz: 11, color: { rgb: "1E3C72" } },
        };
      }
    });

    // ── Style header row (row 7: 5 info + 1 blank + 1 header) ────
    const HEADER_COLS = ["A", "B", "C", "D", "E", "F", "G", "H"];
    HEADER_COLS.forEach((col) => {
      const ref = `${col}7`;
      if (ws[ref]) {
        ws[ref].s = {
          fill: { patternType: "solid", fgColor: { rgb: "1E3C72" } },
          font: { bold: true, sz: 11, color: { rgb: "FFFFFF" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: { bottom: { style: "thin", color: { rgb: "4FC3F7" } } },
        };
      }
    });

    XLSX.utils.book_append_sheet(wb, ws, "Cost Sheet");

    const fileName = `CostSheet_${costSheetData.batch_no || "export"}.xlsx`;
    XLSX.writeFile(wb, fileName, { cellStyles: true });
  }

  async function handleAdvanceSearchPopup() {
    let data = [];
    const getData = await __getAll();

    if (getData && getData !== "Error" && getData[0].Batch.length > 0) {
      const listData = getData[0].Batch;
      listData.forEach((value, index) => {
        data.push({
          batch_id_search: value.id,
          batch_no_search: value.batch_no,
          model_search: value.model?.name || "",
        });
      });
    }

    console.log("*******All Data********");
    console.log(data);

    let msg = "";
    if (data.length > 20) {
      msg = "Only 20 records are loaded. Please narrow your search";
      data = data.slice(0, 20);
    }

    config["CONTROL_CENTER"].showAdvanceSearch(data, msg);
  }

  async function __getAll() {
    try {
      const key = "Batch";
      const distinct = false;
      const select = ["*"];
      const where = [{ active: true }];
      const orderby = "created_at:desc";
      const limit = 25;
      const relations = ["model"];

      const data = await __getDetails(
        key,
        distinct,
        select,
        where,
        relations,
        orderby,
        limit,
      );

      return data;
    } catch (error) {
      console.log("***********GetAll Error**********");
      console.log(error.response);
      return "Error";
    }
  }

  async function __getDetails(
    key,
    distinct,
    select,
    where,
    relations,
    orderby,
    limit,
  ) {
    try {
      const apiRequest = {
        [key]: {
          distinct: distinct,
          select: select,
          where: where,
          relations: relations,
          orderby: orderby,
          limit: limit,
        },
      };

      const getDetails = await API.post(`searchByParameters`, apiRequest);
      const details = getDetails.data;

      return details;
    } catch (error) {
      console.log("***********GetDetails Error**********");
      console.log(error.response);
      return "Error";
    }
  }

  async function handleAdvanceSearch(event, searchCriteria, callback) {
    console.log("*******Search Criteria********");
    console.log(searchCriteria);

    let data = [];
    let searchDetails = await __getAdvanceSearchDetails(searchCriteria);

    if (searchDetails.length > 0) {
      searchDetails.forEach((value, index) => {
        data.push({
          batch_id_search: value.id,
          batch_no_search: value.batch_no,
          model_search: value.model_name,
        });
      });
    }

    console.log("*******Search Results********");
    console.log(data);

    let msg = "";
    if (data.length > 20) {
      msg = "Only 20 records are loaded. Please narrow your search";
      data = data.slice(0, 20);
    }

    callback(data, msg);
  }

  // Get Advance Search Details
  async function __getAdvanceSearchDetails(searchCriteria) {
    try {
      const apiRequest = {
        id:
          searchCriteria.batch_id_search === ""
            ? "%"
            : searchCriteria.batch_id_search,
        batch_no:
          searchCriteria.batch_no_search === ""
            ? "%"
            : searchCriteria.batch_no_search,
        model_name:
          searchCriteria.model_search === ""
            ? "%"
            : searchCriteria.model_search,
      };
      const getSearchDetails = await API.post(
        `Batch/getSearchByBatch`,
        apiRequest,
      );
      const details = getSearchDetails.data.data;

      return details;
    } catch (error) {
      console.log("***********GetDetails Error**********");
      console.log(error.response);
      return "Error";
    }
  }

  async function handleAdvanceSearchDone(event, selectedRow) {
    const id = selectedRow.batch_id_search;

    await formPopulate(id);
  }

  async function formPopulate(id) {
    try {
      document.getElementById("spinner").style.display = "";
      const response = await API.post(`Batch/getCostSheetDataById`, {
        id: parseInt(id),
      });

      if (response.status === 200 || response.status === 201) {
        const raw = response.data.data;
        const mrnSummary = response.data.mrn_summary || [];

        // Calculate total order qty from qty_json (e.g. { L: "1000", XL: "500" })
        const totalQty = Object.values(raw.qty_json || {}).reduce(
          (sum, v) => sum + (parseFloat(v) || 0),
          0,
        );

        // Build consumption lookup from model stock items: code → consumption
        const consumptionMap = {};
        (raw.model?.model_stock_items || []).forEach((msi) => {
          if (msi.stock_item?.code) {
            consumptionMap[msi.stock_item.code] = parseFloat(msi.consumption) || 0;
          }
        });

        // Build display items from mrn_summary
        const items = mrnSummary.map((entry) => {
          const requiredQty = parseFloat(entry.total_qty) || 0;
          const issuedQty = parseFloat(entry.total_issued_qty) || 0;
          const unitCost = parseFloat(entry.avg_grn_price) || 0;
          return {
            material_code: entry.stock_item_code,
            material_name: entry.stock_item_name,
            required_qty: requiredQty,
            consumption: consumptionMap[entry.stock_item_code] ?? 0,
            issued_qty: issuedQty,
            actual_consumption: totalQty > 0 ? issuedQty / totalQty : 0,
            unit_cost: unitCost,
            total_required_cost: requiredQty * unitCost,
            total_issued_cost: issuedQty * unitCost,
            category: entry.category
          };
        });

        const totalMaterialCost = items.reduce(
          (sum, i) => sum + (i.total_required_cost || 0),
          0,
        );

        const groupMap = {};
        items.forEach((item) => {
          const cat = item.category || "Others";
          if (!groupMap[cat]) groupMap[cat] = [];
          groupMap[cat].push(item);
        });
        const materialGroups = Object.entries(groupMap).map(([category, groupItems]) => ({
          category,
          items: groupItems,
        }));

        const data = {
          batch_no: raw.batch_no,
          model_id: raw.model?.id,
          main_model_name: raw.model?.main_model?.name || raw.model?.name || "",
          model_name: raw.model?.name || "",
          color: raw.model?.color || "",
          total_qty: totalQty,
          total_material_cost: totalMaterialCost,
          material_groups: materialGroups,
        };

        const groups = {};
        materialGroups.forEach((g) => {
          groups[g.category] = true;
        });
        setExpandedGroups(groups);
        setCostSheetData(data);
      } else {
        config["CONTROL_CENTER"].promptWarningMessage(
          "Error fetching Cost Sheet details",
          "",
        );
      }
    } catch (error) {
      console.log(error);
      handleError(error);
    } finally {
      document.getElementById("spinner").style.display = "none";
    }
  }

  return generateCostSheetDisplay(
    config,
    costSheetData,
    expandedGroups,
    toggleGroup,
  );
};

export default CostSheetView;
