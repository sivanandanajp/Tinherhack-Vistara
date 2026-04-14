async function requestApi(path, options = {}) {
    const response = await fetch(path, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers
        }
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.error || "Something went wrong. Please try again.");
    }
    return result;
}

function showMessage(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
    element.hidden = false;
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = document.querySelector("#form-message");
        const button = loginForm.querySelector("button");
        button.disabled = true;
        try {
            await requestApi("/api/login", {
                method: "POST",
                body: JSON.stringify({
                    username: document.querySelector("#username").value,
                    password: document.querySelector("#password").value
                })
            });
            window.location.href = "opportunities.html";
        } catch (error) {
            showMessage(message, error.message, true);
        } finally {
            button.disabled = false;
        }
    });
}

const registerForm = document.querySelector("#register-form");
if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = document.querySelector("#form-message");
        const button = registerForm.querySelector("button");
        button.disabled = true;
        try {
            await requestApi("/api/register", {
                method: "POST",
                body: JSON.stringify({
                    username: document.querySelector("#new-username").value,
                    password: document.querySelector("#new-password").value
                })
            });
            window.location.href = "opportunities.html";
        } catch (error) {
            showMessage(message, error.message, true);
        } finally {
            button.disabled = false;
        }
    });
}

const jobListings = document.querySelector("#job-listings");
if (jobListings) {
    const escapeText = (value) => {
        const node = document.createElement("span");
        node.textContent = value;
        return node.innerHTML;
    };

    const savedJobsKey = "vistara-saved-jobs";
    let jobs = [];
    let isLoading = false;
    let showSavedOnly = false;

    function getSavedJobs() {
        try {
            const value = JSON.parse(localStorage.getItem(savedJobsKey) || "[]");
            return Array.isArray(value) ? value.map(Number).filter(Number.isInteger) : [];
        } catch {
            return [];
        }
    }

    function showJobMessage(message, isError = false, offerLogin = false) {
        const element = document.querySelector("#job-message");
        showMessage(element, message, isError);
        if (offerLogin) {
            const link = document.createElement("a");
            link.href = "login.html";
            link.textContent = " Sign in";
            element.append(link);
        }
    }

    function updateLocations() {
        const locationFilter = document.querySelector("#location-filter");
        const selectedLocation = locationFilter.value;
        const locations = [...new Set(jobs.map((job) => job.location))].sort((a, b) => a.localeCompare(b));
        locationFilter.replaceChildren(new Option("All locations", ""));
        for (const location of locations) {
            locationFilter.add(new Option(location, location));
        }
        locationFilter.value = locations.includes(selectedLocation) ? selectedLocation : "";
    }

    function renderJobs() {
        const savedIds = getSavedJobs();
        const query = document.querySelector("#job-search").value.trim().toLocaleLowerCase();
        const location = document.querySelector("#location-filter").value;
        const sort = document.querySelector("#sort-jobs").value;
        const visibleJobs = jobs.filter((job) => {
            const searchable = [job.title, job.company, job.location, job.description, job.skills]
                .join(" ")
                .toLocaleLowerCase();
            return (!query || searchable.includes(query))
                && (!location || job.location === location)
                && (!showSavedOnly || savedIds.includes(job.id));
        });

        if (sort === "title") visibleJobs.sort((a, b) => a.title.localeCompare(b.title));
        if (sort === "location") visibleJobs.sort((a, b) => a.location.localeCompare(b.location));

        document.querySelector("#total-jobs").textContent = jobs.length;
        document.querySelector("#visible-jobs").textContent = visibleJobs.length;
        document.querySelector("#saved-count").textContent = savedIds.length;
        jobListings.replaceChildren();

        if (visibleJobs.length === 0) {
            const emptyState = document.createElement("div");
            emptyState.className = "empty-state";
            emptyState.innerHTML = `
                <strong>${jobs.length ? "No opportunities match those filters" : "Finding opportunities…"}</strong>
                <span>${jobs.length ? "Try another search or clear a filter to see more roles." : "Refresh the board or check back soon."}</span>`;
            jobListings.append(emptyState);
            return;
        }

        jobListings.replaceChildren();
        for (const job of visibleJobs) {
            const article = document.createElement("article");
            article.className = "job-item";
            article.innerHTML = `
                <div class="job-topline">
                    <div><h3>${escapeText(job.title)}</h3><p class="company">${escapeText(job.company)}</p></div>
                    <span class="job-badge">${job.applied ? "Interested" : "Opportunity"}</span>
                </div>
                <p class="job-description">${escapeText(job.description)}</p>
                <div class="job-meta"><span>📍 ${escapeText(job.location)}</span><span>◷ ${escapeText(job.salary)}</span></div>
                <p class="job-skills"><strong>Skills:</strong> ${escapeText(job.skills)}</p>
                <div class="job-actions">
                    <button class="button" type="button" data-action="apply" data-job-id="${job.id}" ${job.applied ? "disabled" : ""}>
                        ${job.applied ? "Interest recorded" : "I'm interested"}
                    </button>
                    <button class="toggle-button save-button" type="button" data-action="save" data-job-id="${job.id}" aria-pressed="${savedIds.includes(job.id)}">
                        ${savedIds.includes(job.id) ? "♥ Saved" : "♡ Save"}
                    </button>
                </div>`;
            jobListings.append(article);
        }
    }

    async function loadJobs({ background = false } = {}) {
        if (isLoading) return;
        isLoading = true;
        const refreshButton = document.querySelector("#refresh-jobs");
        const updatedText = document.querySelector("#last-updated");
        jobListings.setAttribute("aria-busy", "true");
        refreshButton.disabled = true;
        refreshButton.querySelector("span").textContent = "Refreshing…";
        try {
            const response = await requestApi("/api/jobs");
            jobs = response.jobs;
            updateLocations();
            renderJobs();
            updatedText.textContent = `Updated ${new Intl.DateTimeFormat(undefined, {
                hour: "numeric",
                minute: "2-digit"
            }).format(new Date())} · refreshes every 30 seconds`;
            document.querySelector("#job-message").hidden = true;
        } catch (error) {
            if (!background) showJobMessage(error.message, true);
            updatedText.textContent = "Could not refresh the job board.";
            if (!jobs.length) {
                jobListings.innerHTML = `<div class="empty-state"><strong>We couldn't load opportunities</strong><span>Check your connection and try refreshing.</span></div>`;
            }
        } finally {
            isLoading = false;
            jobListings.setAttribute("aria-busy", "false");
            refreshButton.disabled = false;
            refreshButton.querySelector("span").textContent = "Refresh";
        }
    }

    jobListings.addEventListener("click", async (event) => {
        const button = event.target.closest("button[data-job-id]");
        if (!button) return;
        const jobId = Number(button.dataset.jobId);

        if (button.dataset.action === "save") {
            const savedIds = getSavedJobs();
            const nextSavedIds = savedIds.includes(jobId)
                ? savedIds.filter((id) => id !== jobId)
                : [...savedIds, jobId];
            localStorage.setItem(savedJobsKey, JSON.stringify(nextSavedIds));
            renderJobs();
            return;
        }

        if (button.dataset.action !== "apply") return;
        button.disabled = true;
        try {
            const result = await requestApi(`/api/jobs/${jobId}/apply`, {
                method: "POST",
                body: "{}"
            });
            showJobMessage(result.message);
            await loadJobs();
        } catch (error) {
            showJobMessage(error.message, true, error.message.includes("log in"));
            button.disabled = false;
        }
    });

    for (const control of ["#job-search", "#location-filter", "#sort-jobs"]) {
        document.querySelector(control).addEventListener(
            control === "#job-search" ? "input" : "change",
            renderJobs
        );
    }
    document.querySelector("#saved-filter").addEventListener("click", (event) => {
        showSavedOnly = !showSavedOnly;
        event.currentTarget.setAttribute("aria-pressed", String(showSavedOnly));
        event.currentTarget.textContent = showSavedOnly ? "♥ Showing saved" : "♡ Saved";
        renderJobs();
    });
    document.querySelector("#refresh-jobs").addEventListener("click", () => loadJobs());

    const jobForm = document.querySelector("#job-post-form");
    jobForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = jobForm.querySelector("button");
        button.disabled = true;
        const formData = new FormData(jobForm);
        try {
            const result = await requestApi("/api/jobs", {
                method: "POST",
                body: JSON.stringify(Object.fromEntries(formData))
            });
            showJobMessage(result.message);
            jobForm.reset();
            await loadJobs();
        } catch (error) {
            showJobMessage(error.message, true, error.message.includes("log in"));
        } finally {
            button.disabled = false;
        }
    });

    const logoutButton = document.querySelector("#logout-button");
    requestApi("/api/me").then(({ user }) => {
        const accountStatus = document.querySelector("#account-status");
        accountStatus.textContent = user ? `Signed in as ${user.username}` : "Browsing as a guest";
        logoutButton.hidden = !user;
        document.querySelector("#login-link").hidden = Boolean(user);
    }).catch((error) => {
        showJobMessage(error.message, true);
    });
    logoutButton.addEventListener("click", async () => {
        try {
            await requestApi("/api/logout", { method: "POST", body: "{}" });
            window.location.reload();
        } catch (error) {
            showJobMessage(error.message, true);
        }
    });

    renderJobs();
    loadJobs();
    window.setInterval(() => loadJobs({ background: true }), 30_000);
}
