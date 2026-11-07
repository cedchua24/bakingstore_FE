import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import ReportSales from "./ReportSales";
import ShopOrderTransactionService from "../ShopOrderTransaction/ShopOrderTransactionService";

jest.mock("../ShopOrderTransaction/ShopOrderTransactionService");
jest.mock("./ReportSalesChart", () => () => null);

test("shows payments received for earlier transactions in the selected period", async () => {
    ShopOrderTransactionService.fetchSalesListV2.mockResolvedValue({
        data: {
            data: [
                {
                    date: "2026-10-31",
                    total_count: 4,
                    total_cash: 100,
                    total_online: 200,
                    total_sales: 300,
                },
            ],
            total_sales: 300,
            total_paid_inside_period: 174.5,
            total_paid_outside_period: 125.5,
            total_paid_inside_period_count: 2,
            total_paid_outside_period_count: 2,
            total_received: 300,
        },
    });

    render(
        <MemoryRouter>
            <ReportSales />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText("From"), { target: { value: "2026-10-01" } });
    fireEvent.change(screen.getByLabelText("To"), { target: { value: "2026-10-31" } });
    fireEvent.click(screen.getByRole("button", { name: "Generate report" }));

    const paymentPeriod = await screen.findByRole("region", {
        name: "Payment period breakdown",
    });

    expect(ShopOrderTransactionService.fetchSalesListV2).toHaveBeenCalledWith({
        dateFrom: "2026-10-01",
        dateTo: "2026-10-31",
    });
    const totalCard = within(paymentPeriod).getByText("Total money received").closest("article");
    const insideCard = within(paymentPeriod).getByText("Orders placed inside period").closest("article");
    const outsideCard = within(paymentPeriod).getByText("Orders placed outside period").closest("article");
    expect(within(totalCard).getByText(/300\.00/)).toBeInTheDocument();
    expect(within(insideCard).getByText(/174\.50/)).toBeInTheDocument();
    expect(within(outsideCard).getByText(/125\.50/)).toBeInTheDocument();
    expect(within(paymentPeriod).getByText("Totals reconciled")).toBeInTheDocument();
    expect(within(paymentPeriod).getByText("How this report counts payments")).toBeInTheDocument();
    const dailyTable = screen.getByRole("table");
    const footerRow = within(dailyTable).getAllByRole("row").at(-1);
    expect(within(footerRow).getByText("Total")).toBeInTheDocument();
    expect(within(footerRow).getByText("4")).toBeInTheDocument();
    expect(within(footerRow).getByText(/300\.00/)).toBeInTheDocument();
});
