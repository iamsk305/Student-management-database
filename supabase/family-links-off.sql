-- Turns family links off: nobody outside your login can read anything, even with an old link.
revoke execute on function family_view(text) from anon;
