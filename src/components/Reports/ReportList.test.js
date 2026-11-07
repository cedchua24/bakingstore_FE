import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
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
        data: {
            data: [{ date: "2026-09-19", total_sales: 200, total_profit: 50, total_count: 2 }],
            total_sales: 200,
            total_profit: 50,
            total_count: 2,
        },
    });
    ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReportByDateV2.mockResolvedValue({
        data: {
            data: [{ date: "2026-09-19", total_sales: 350, total_profit: 80, total_count: 3 }],
            total_sales: 350,
            total_profit: 80,
            total_count: 3,
        },
    });
    ExpenseTransactionService.getTotalExpenseWithFilters.mockResolvedValue({
        data: { total_expense: 10 },
    });
    DiscountService.fetchDiscountLossReport.mockResolvedValue({ data: { data: [] } });
    DiscountService.fetchDiscountSummary.mockResolvedValue({
        data: { discount_amount: -15.75, shop_order_total_price: 150.75 },
    });
    render(
        <MemoryRouter>
            <ReportList />
        </MemoryRouter>
    );
    fireEvent.change(screen.getByLabelText("From"), { target: { value: "2026-09-01" } });
    fireEvent.change(screen.getByLabelText("To"), { target: { value: "2026-09-19" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate report" }));
    await screen.findByText("25.00% profit margin");
    expect(DiscountService.fetchDiscountSummary).toHaveBeenCalledWith({
        dateFrom: "2026-09-01", dateTo: "2026-09-19",
    });
    expect(
        ShopOrderTransactionService.fetchOnlineShopOrderTransactionListReportByDateV2
    ).toHaveBeenCalledWith({
        dateFrom: "2026-09-01", dateTo: "2026-09-19",
    });
    const fullyPaidProjection = screen.getByRole("region", {
        name: "Fully paid transaction projection",
    });
    expect(within(fullyPaidProjection).getByText("If every in-period transaction is fully paid")).toBeInTheDocument();
    expect(within(fullyPaidProjection).getByText(/350\.00/)).toBeInTheDocument();
    expect(within(fullyPaidProjection).getByText(/80\.00/)).toBeInTheDocument();
    expect(within(fullyPaidProjection).getByText("22.86% potential profit margin")).toBeInTheDocument();
    expect(within(fullyPaidProjection).getByText(/150\.00/)).toBeInTheDocument();
    expect(within(fullyPaidProjection).getByText(/30\.00/)).toBeInTheDocument();
    const orderHistory = screen.getByText("Transaction summary by order date").closest("section");
    expect(within(orderHistory).getByText("Total transactions")).toBeInTheDocument();
    expect(within(orderHistory).getByText("Fully paid", { selector: "th" })).toBeInTheDocument();
    expect(within(orderHistory).getByText("Not yet fully paid")).toBeInTheDocument();
    const historyRows = within(orderHistory).getAllByRole("row");
    expect(within(historyRows[1]).getByText("3")).toBeInTheDocument();
    expect(within(historyRows[1]).getByText("2")).toBeInTheDocument();
    expect(within(historyRows[1]).getByText("1")).toBeInTheDocument();
    expect(
        screen.queryByLabelText("Show only sales included in this profitability report")
    ).not.toBeInTheDocument();
    expect(screen.getByText("Fully paid profitability orders")).toBeInTheDocument();
    const checkbox = screen.getByLabelText("Remove sales from orders with no profit");
    expect(checkbox).not.toBeChecked();
    const salesCard = screen.getByText("Total sales", { selector: "span" }).closest("article");
    expect(within(salesCard).getByText(/200\.00/)).toBeInTheDocument();
    fireEvent.click(checkbox);
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
