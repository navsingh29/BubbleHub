class JavaClass(object):

    def __init__(self, class_name, file_name=None, package=None, superclass=None):
        self.name = class_name
        self.methods = []
        self.fields = []
        self.interfaces = []
        self._file_name = file_name
        self._package = package
        self.superclass = superclass

    @property
    def file_name(self):
        return self._file_name

    @file_name.setter
    def file_name(self, value):
        self._file_name = value

    @property
    def package(self):
        return self._package

    @package.setter
    def package(self, value):
        self._package = value

    @property
    def superclass(self):
        return self._superclass

    @superclass.setter
    def superclass(self, value):
        self._superclass = value

    def add_field(self, field):
        self.fields.append(field)

    def add_method(self, method):
        self.methods.append(method)

    def add_interface(self, interface):
        self.interfaces.append(interface)

    def __str__(self):
        return "%s" % self.name

class JavaInterface(JavaClass):

    def __init__(self, name, file_name=None, package=None, superclass=None):
        self.name = name
        self._file_name = file_name
        self._package = package
        self.superclass = superclass
        self.fields = []
        self.extends = []
        self.methods = []

    @property
    def file_name(self):
        return self._file_name

    @file_name.setter
    def file_name(self, value):
        self._file_name = value

    @property
    def package(self):
        return self._package

    @package.setter
    def package(self, value):
        self._package = value

    def add_extends(self, extend):
        self.extends.append(extend)

    def add_field(self, field):
        self.fields.append(field)

    def add_method(self, method):
        self.methods.append(method)

    def __str__(self):
        return "%s -> extends %s" % (self.name, ", ".join(self.extends))

class JavaVariableBinding(object):

    def __init__(self, field_type, field_name):
        self.field_type = field_type
        self.field_name = field_name

    def __str__(self):
        return "%s %s" % (self.field_type, self.field_name)

class JavaMethod(object):

    def __init__(self, method_name, visibility="private", return_type=None):
        self.method_name = method_name
        self.parameters = []
        self.body_vars = []
        self._visibility = visibility
        self._return_type = return_type

    @property
    def visibility(self):
        return self._visibility

    @visibility.setter
    def visibility(self, value):
        self._visibility = value

    @property
    def return_type(self):
        return self._return_type

    @return_type.setter
    def return_type(self, value):
        self._return_type = value

    def add_param(self, param):
        self.parameters.append(param)

    def add_body_var(self, var):
        self.body_vars.append(var)

    def __str__(self):
        params = ", ".join(str(param) for param in self.parameters)

        return "%s %s(%s)" % (self.return_type, self.method_name, params)



