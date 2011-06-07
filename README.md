Formly
=======

The form glamorizer for jQuery was written by Daniel Raftery.


How to use
===========

For example imagine that you have the form below:

    <form id="MyForm" width="400px">
       Your name: <input type="text" name="Name" />
       Email address: <input type="text" name="Email" validate="email" />
       Username: <input type="text" name="Username" place="No spaces" label="Username" require="true" />
       Password: <input type="password" name="Password" label="Password" require="true" />
       <input type="submit" value="Sign up" /><input type="reset" value="Clear" />
    </form>

After on the page you need to use Formly put the script tag for jQuery and for Formly and link tag to import css as code in the sequence:

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.4.4.min.js"></script>
    <script type="text/javascript" src="js/formly.js"></script>
    <link rel="stylesheet" href="css/formly.standard.css" type="text/css" />
    <link rel="stylesheet" href="css/themes/formly.base.css" type="text/css" />

Now you need declare another script tag to associate the form above with Formly:

    <script>
       $(document).ready(function()
           { $('#MyForm').formly(); }
       );
    </script>

Finally, you see the awesome result using the Formly on your form with Base theme.

Contributors
=============

 - (Bruno Arueira)[http://github.com/brunoarueira]

Author
=============

 - (Daniel Raftery)[http://github.com/thrivingkings]
