// Set a cookie with a specified name, value, and expiration days
export function setCookie(cname: string, cvalue: string, exdays: number): void {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${cname}=${cvalue}; ${expires}; path=/`;
  }
  
  // Get a cookie value by its name
  export function getCookie(cname: string): string {
    const name = `${cname}=`;
    const ca = document.cookie.split(";");
  
    for (let i = 0; i < ca.length; i++) {
      const c = ca[i].trim(); // Trim whitespace from cookie string
      if (c.indexOf(name) === 0) {
        return c.substring(name.length); // Return the cookie value
      }
    }
    return ""; // Return an empty string if the cookie is not found
  }
  
  // Check if a cookie exists and prompt the user to enter a name if not
  export function checkCookie(): void {
    const user = getCookie("username");
    if (user) {
      alert(`Welcome again ${user}`);
    } else {
      const promptResponse = prompt("Please enter your name:", "");
      if (promptResponse && promptResponse.trim()) {
        setCookie("username", promptResponse, 365);
      }
    }
  }
  
  // Delete a cookie by its name
  export function deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  