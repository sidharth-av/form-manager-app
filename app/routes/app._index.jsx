import { useState, useCallback } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit, useNavigation } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Filters,
  EmptySearchResult,
  Text,
  EmptyState,
  Pagination,
  Banner,
  Button,
  IndexTable,
  useIndexResourceState,
  Frame,
  Loading,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const pageSize = parseInt(url.searchParams.get("pageSize") || "10", 10);
  const searchTerm = url.searchParams.get("searchTerm") || "";
  const sortField = url.searchParams.get("sortField") || "submissionDate";
  const sortDirection = url.searchParams.get("sortDirection") || "desc";

  const skip = (page - 1) * pageSize;

  const searchFilter = searchTerm
    ? {
      OR: [
        { name: { contains: searchTerm } },
        { email: { contains: searchTerm } },
        { phoneNumber: { contains: searchTerm } },
      ],
    }
    : {};

  const orderBy = { [sortField]: sortDirection };

  try {
    const submissions = await prisma.formSubmission.findMany({
      where: searchFilter,
      orderBy,
      skip,
      take: pageSize,
    });

    const totalCount = await prisma.formSubmission.count({
      where: searchFilter,
    });

    return json({
      submissions,
      pagination: {
        totalCount,
        currentPage: page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
      filters: {
        searchTerm,
        sortField,
        sortDirection,
      },
    });
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return json({
      submissions: [],
      pagination: {
        totalCount: 0,
        currentPage: 1,
        pageSize,
        totalPages: 0,
      },
      filters: {
        searchTerm: "",
        sortField: "submissionDate",
        sortDirection: "desc",
      },
      error: "Failed to load submissions",
    });
  }
};

export default function SubmissionsPage() {
  const {
    submissions,
    pagination,
    filters,
    error,
  } = useLoaderData();

  const submit = useSubmit();
  const navigate = useNavigation();
  const isLoading = navigate.state === "loading";

  const [searchValue, setSearchValue] = useState(filters.searchTerm || "");
  const [tempSearchValue, setTempSearchValue] = useState(searchValue);

  const handleSearchChange = useCallback((value) => {
    setTempSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback(() => {
    setSearchValue(tempSearchValue);
    const formData = new FormData();
    formData.append("searchTerm", tempSearchValue);
    formData.append("page", "1");
    formData.append("pageSize", pagination.pageSize);
    formData.append("sortField", filters.sortField);
    formData.append("sortDirection", filters.sortDirection);
    submit(formData, { method: "get" });
  }, [tempSearchValue, pagination.pageSize, filters.sortField, filters.sortDirection, submit]);

  const handlePageChange = useCallback((newPage) => {
    const formData = new FormData();
    formData.append("page", newPage.toString());
    formData.append("pageSize", pagination.pageSize);
    formData.append("searchTerm", searchValue);
    formData.append("sortField", filters.sortField);
    formData.append("sortDirection", filters.sortDirection);
    submit(formData, { method: "get" });
  }, [pagination.pageSize, searchValue, filters.sortField, filters.sortDirection, submit]);

  const handleSort = useCallback((sortField) => {
    const newDirection = filters.sortField === sortField && filters.sortDirection === "asc" ? "desc" : "asc";
    const formData = new FormData();
    formData.append("page", pagination.currentPage);
    formData.append("pageSize", pagination.pageSize);
    formData.append("searchTerm", searchValue);
    formData.append("sortField", sortField);
    formData.append("sortDirection", newDirection);
    submit(formData, { method: "get" });
  }, [filters.sortField, filters.sortDirection, pagination.currentPage, pagination.pageSize, searchValue, submit]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const resourceName = {
    singular: 'submission',
    plural: 'submissions',
  };

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(submissions);

  const getSortDirectionIcon = (field) => {
    if (filters.sortField === field) {
      return filters.sortDirection === "asc" ? "↑" : "↓";
    }
    return null;
  };

  return (
    <Frame>
      <Page title="Form Submissions">
        {isLoading && <Loading />}
        {error && (
          <Banner status="critical">
            <p>There was an error loading the submissions: {error}</p>
          </Banner>
        )}

        <Layout>
          <Layout.Section>
            <Card padding={0}>
              <Filters
                queryValue={tempSearchValue}
                filters={[]}
                onQueryChange={handleSearchChange}
                onQueryClear={() => setTempSearchValue("")}
                onClearAll={() => {
                  setTempSearchValue("");
                  setSearchValue("");
                }}
                onQueryFocus={() => { }}
                queryPlaceholder="Search by name, email, or phone number"
              >
                <Button onClick={handleSearchSubmit} disabled={isLoading}>
                  Search
                </Button>
              </Filters>
              {submissions.length === 0 ? (
                searchValue ? (
                  <EmptySearchResult
                    title="No submissions found"
                    description="Try changing the filters or search term"
                    withIllustration
                  />
                ) : (
                  <EmptyState
                    heading="No form submissions yet"
                    image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                  >
                    <p>
                      Form submissions will appear here once customers start filling out your contact form.
                    </p>
                  </EmptyState>
                )
              ) : (
                  <IndexTable
                    resourceName={resourceName}
                    itemCount={submissions.length}
                    selectedItemsCount={
                      allResourcesSelected ? 'All' : selectedResources.length
                    }
                    onSelectionChange={handleSelectionChange}
                    headings={[
                      { title: <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleSort('name')}>Name {getSortDirectionIcon('name')}</button> },
                      { title: <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleSort('email')}>Email {getSortDirectionIcon('email')}</button> },
                      { title: <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleSort('phoneNumber')}>Phone Number {getSortDirectionIcon('phoneNumber')}</button> },
                      { title: <button style={{ backgroundColor: 'transparent', border: 'none' }} onClick={() => handleSort('submissionDate')}>Submission Date {getSortDirectionIcon('submissionDate')}</button> },
                    ]}
                  >
                    {submissions.map((submission, index) => (
                      <IndexTable.Row
                        id={submission.id}
                        key={submission.id}
                        selected={selectedResources.includes(submission.id)}
                        position={index}
                      >
                        <IndexTable.Cell>
                          <Text variant="bodyMd" fontWeight="bold">
                            {submission.name}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text variant="bodyMd">
                            {submission.email}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text variant="bodyMd">
                            {submission.phoneNumber}
                          </Text>
                        </IndexTable.Cell>
                        <IndexTable.Cell>
                          <Text variant="bodyMd">
                            {formatDate(submission.submissionDate)}
                          </Text>
                        </IndexTable.Cell>
                      </IndexTable.Row>
                    ))}
                  </IndexTable>
              )}
            </Card>

            {submissions.length > 10 && (
              <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
                <Pagination
                  hasPrevious={pagination.currentPage > 1}
                  onPrevious={() => handlePageChange(pagination.currentPage - 1)}
                  hasNext={pagination.currentPage < pagination.totalPages}
                  onNext={() => handlePageChange(pagination.currentPage + 1)}
                  label={`Page ${pagination.currentPage} of ${pagination.totalPages}`}
                />
              </div>
            )}
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}

