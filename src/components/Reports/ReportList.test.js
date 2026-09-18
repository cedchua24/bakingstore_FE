import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReportList from "./ReportList";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";
import ExpenseTransactionService from "../ExpensesV2/ExpenseTransactionService";
import ExpenseTypeV2Service from "../ExpensesV2/ExpensesTypeV2Service";
import DiscountService from "../OtherService/DiscountService";

jest.mock("../ShopOrderTransaction/ShopOrderTransactionService");
jest.mock("../ExpensesV2/ExpenseTransactionService");
jest.mock("../ExpensesV2/ExpensesTypeV2Service");
jest.mock("../OtherService/DiscountService");
jest.mock("./ReportBar", () => () => null);

test("discount checkbox removes zero-profit sales and recalculates margins", async () => {
    localStorage.setItem("role_as", "2");
    ExpenseTypeV2Service.getAll.mockResolvedValue({ data: [] });
    ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReportByDate.mockResolvedValue({
        data: { data: [], total_sales: 200, total_profit: 50 },
    });
    ShopOrderTransactionService.fetchSalesListV2.mockResolvedValue({
        data: { data: [{ total_sales: 150 }, { total_sales: 100 }] },
    });
    ExpenseTransactionService.getTotalExpenseWithFilters.mockResolvedValue({
        data: { total_expense: 10 },
    });
    DiscountService.fetchDiscountLossReport.mockResolvedValue({ data: { data: [] } });
    DiscountService.fetchDiscountSummary.mockResolvedValue({
        data: { discount_amount: -15.75, shop_order_total_price: 150.75 },
    });
    render(<ReportList />);
    fireEvent.change(screen.getByLabelText("From"), { target: { value: "2026-09-01" } });
    fireEvent.change(screen.getByLabelText("To"), { target: { value: "2026-09-19" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate report" }));
    await screen.findByText("20.00% profit margin");
    expect(DiscountService.fetchDiscountSummary).toHaveBeenCalledWith({
        dateFrom: "2026-09-01", dateTo: "2026-09-19",
    });
    expect(ShopOrderTransactionService.fetchSalesListV2).toHaveBeenCalledWith({
        dateFrom: "2026-09-01", dateTo: "2026-09-19",
    });
    const allSalesCard = screen.getByText("Total sales", { selector: "span" }).closest("article");
    expect(within(allSalesCard).getByText(/250\.00/)).toBeInTheDocument();
    const sourceCheckbox = screen.getByLabelText(
        "Show only sales included in this profitability report"
    );
    expect(sourceCheckbox).not.toBeChecked();
    fireEvent.click(sourceCheckbox);
    expect(within(allSalesCard).getByText(/200\.00/)).toBeInTheDocument();
    expect(screen.getByText("25.00% profit margin")).toBeInTheDocument();
    const checkbox = screen.getByLabelText("Remove sales from orders with no profit");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    const salesCard = screen.getByText("Adjusted sales", { selector: "span" }).closest("article");
    expect(within(salesCard).getByText(/49\.25/)).toBeInTheDocument();
    expect(within(salesCard).getByText(/200\.00/)).toBeInTheDocument();
    expect(within(salesCard).getByText(/150\.75/)).toBeInTheDocument();
    const zeroProfitCard = screen.getByText("Sales from orders with no profit").closest("article");
    expect(within(zeroProfitCard).getByText(/150\.75/)).toBeInTheDocument();
    expect(within(zeroProfitCard).getByText("Removed from total sales")).toBeInTheDocument();
    expect(screen.getByText("101.52% profit margin based on adjusted sales")).toBeInTheDocument();
    expect(screen.getByText("81.22% net profit margin")).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(screen.getByText("25.00% profit margin")).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(screen.getByText("101.52% profit margin based on adjusted sales")).toBeInTheDocument();
    localStorage.clear();
});
