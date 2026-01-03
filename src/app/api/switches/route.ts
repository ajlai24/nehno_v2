import { ITEMS_PER_PAGE } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            pageParam = 0,
            queryType = "all",
            selectedFilters,
            searchQuery,
            forceMin = 0,
            forceMax = 100,
            selectedSortValue,
        } = body;

        const supabase = await createClient();

        // Determine the correct offset range based on total count and requested page
        let offsetStart = pageParam * ITEMS_PER_PAGE;
        let offsetEnd = (pageParam + 1) * ITEMS_PER_PAGE - 1;

        // Fetch total count first, if possible, to prevent over-requesting
        const { data: totalData, error: countError } = await supabase
            .from("switches")
            .select("id", { count: "exact" })
            .gte("force", forceMin)
            .lte("force", forceMax);

        if (countError) {
            return NextResponse.json(
                { error: "Error fetching total count" },
                { status: 500 }
            );
        }

        const totalCount = totalData?.length || 0;

        // Check if the requested range exceeds the available data
        if (offsetStart >= totalCount) {
            offsetStart = totalCount - 1; // If the offset exceeds the total, set it to the last row.
            offsetEnd = totalCount - 1; // End at the last available row.
        }

        if (offsetEnd >= totalCount) {
            offsetEnd = totalCount - 1; // Ensure the end does not exceed the total count.
        }

        // Sort options
        let sortColumn = "full_name";
        let sortOrder = "asc";

        switch (selectedSortValue) {
            case "name_asc":
                sortColumn = "full_name";
                sortOrder = "asc";
                break;
            case "name_desc":
                sortColumn = "full_name";
                sortOrder = "desc";
                break;
            case "force_asc":
                sortColumn = "force";
                sortOrder = "asc";
                break;
            case "force_desc":
                sortColumn = "force";
                sortOrder = "desc";
                break;
            default:
                sortColumn = "full_name";
                sortOrder = "asc";
        }

        // Apply search if queryType is "search"
        if (queryType === "search" && searchQuery) {
            const { data: switches, error } = await supabase.rpc("search_switches", {
                query: searchQuery,
                page: pageParam,
                items_per_page: ITEMS_PER_PAGE,
            });

            if (error) {
                return NextResponse.json(
                    { error: "Error fetching search results" },
                    { status: 500 }
                );
            }

            const totalPages = totalCount ? Math.ceil(totalCount / ITEMS_PER_PAGE) : 0;

            return NextResponse.json({ switches, totalPages, totalCount });
        }

        // Fetch all switches if no filters are provided
        let query = supabase
            .from("switches")
            .select("*", { count: "exact" })
            .range(offsetStart, offsetEnd)
            .gte("force", forceMin)
            .lte("force", forceMax)
            .order(sortColumn, { ascending: sortOrder === "asc" });

        // Apply filters if provided
        if (queryType === "filtered") {
            if (selectedFilters) {
                for (const group in selectedFilters) {
                    const activeFilters = Object.keys(selectedFilters[group]).filter(
                        (filter) => selectedFilters[group][filter]
                    );

                    if (activeFilters.length > 0) {
                        query = query.in(group, activeFilters);
                    }
                }
            }
        }

        const { data: switches, count, error } = await query;

        if (error) {
            return NextResponse.json(
                { error: "Error fetching switches" },
                { status: 500 }
            );
        }

        const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;
        return NextResponse.json({ switches, totalPages });
    } catch (error) {
        console.error("Error in switches API route:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

