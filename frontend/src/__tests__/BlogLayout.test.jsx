import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";

vi.mock("../hooks/usePageTitle", () => ({ usePageTitle: vi.fn() }));

import BlogLayout, { BlogIndex, ARTICLES } from "../pages/BlogLayout";

describe("BlogIndex", () => {
  it("renders all article cards", () => {
    render(
      <MemoryRouter>
        <BlogIndex />
      </MemoryRouter>
    );
    ARTICLES.forEach((a) => {
      expect(screen.getByText(a.title)).toBeInTheDocument();
    });
  });
});

describe("BlogLayout", () => {
  it("renders blog header", () => {
    render(
      <MemoryRouter>
        <BlogLayout />
      </MemoryRouter>
    );
    expect(screen.getByText("DoAide Scheduler Blog")).toBeInTheDocument();
  });
});

describe("Blog articles", () => {
  it("MeetingProductivity renders", async () => {
    const { default: C } = await import("../pages/blog/MeetingProductivity");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("RemoteScheduling renders", async () => {
    const { default: C } = await import("../pages/blog/RemoteScheduling");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("CalendarManagement renders", async () => {
    const { default: C } = await import("../pages/blog/CalendarManagement");
    render(<MemoryRouter><C /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});

describe("BlogIndex lists all 6 articles", () => {
  it("shows new AI scheduling article", () => {
    render(<MemoryRouter><BlogIndex /></MemoryRouter>);
    expect(screen.getByText("How AI Scheduling Saves 10+ Hours Per Week")).toBeInTheDocument();
  });

  it("shows new automated booking article", () => {
    render(<MemoryRouter><BlogIndex /></MemoryRouter>);
    expect(screen.getByText("The Complete Guide to Automated Appointment Booking")).toBeInTheDocument();
  });

  it("shows new customer satisfaction article", () => {
    render(<MemoryRouter><BlogIndex /></MemoryRouter>);
    expect(screen.getByText("5 Ways Smart Scheduling Boosts Customer Satisfaction")).toBeInTheDocument();
  });
});

describe("BlogLayout headings", () => {
  const renderAt = (path) =>
    render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<p>index</p>} />
            <Route path="post" element={<h1>Post title</h1>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

  it("uses the blog name as the h1 on the index", () => {
    renderAt("/blog");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("DoAide Scheduler Blog");
  });

  it("leaves the only h1 to the post on article pages", () => {
    renderAt("/blog/post");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Post title");
  });
});
