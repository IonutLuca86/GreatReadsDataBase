namespace GRDB.AdminUI.Data
{
    // defined routes for navigation
    public static class Routes
    {
        public static string Books => "Books";
        public static string Authors => "Authors";
        public static string Genres => "Genres";
        public static string Users => "Users";
        public static string Login => "Login";
        public static string About => "About";
        public static string Contact => "Contact";

    }

    //defined navigation types used for buttons
    public static class PageType
    {
        public static string Index => "Index";
        public static string Create => "Create";
        public static string Edit => "Edit";
        public static string Delete => "Delete";  
        public static string ChangePassword => "Change Password";
        public static string ChangeRole => "Change Role";
        public static string Search => "Search";
    }
}
