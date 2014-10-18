from models import JavaClass, JavaVariableBinding, JavaMethod, JavaInterface
import os
import plyj.parser
import plyj.model as m

class CodeComplexityAnalyzer(object):

    PRIMITIVES = {
        "byte", "short", "int", "long", "float", "double", "boolean",
        "char"
        }

    VOID = "void"

    def __init__(self):
        pass

    def calculate_complexity(self, java_class):
        """
        Calculates a complexity value for a java class
        :param java_class: a fleshed out JavaClass object containing the parsed
        components
        """
        #TODO:
        pass

    def is_primitive(self, j_type):
        return j_type in self.PRIMITIVES

    def is_return_void(self, return_type):
        return return_type == self.VOID

class JavaParser(m.Visitor):

    PUBLIC = "public"
    PRIVATE = "private"

    def __init__(self, file_name=None):
        super(JavaParser, self).__init__()
        self.first_field = True
        self.first_method = True
        self.java_classes = []
        self.file_name = file_name
        self.current_java_class = None
        self.current_method = None

    def set_file_name(self, file_name):
        self.file_name = file_name

    def visit_ClassDeclaration(self, class_decl):
        self.current_java_class = JavaClass(str(class_decl.name))
        self.java_classes.append(self.current_java_class)

        if class_decl.extends is not None:
            self.current_java_class.superclass = class_decl.extends.name.value
        for interface in class_decl.implements:
            self.current_java_class.add_interface(interface)

        return True

    def visit_InterfaceDeclaration(self, interface_decl):
        self.current_java_class = JavaInterface(str(interface_decl.name))
        self.java_classes.append(self.current_java_class)

        if interface_decl.extends is not None and type(interface_decl.extends) is str:
            self.current_java_class.add_extends(interface_decl.extends.name.value)
        elif type(interface_decl.extends) is list:
            for sc in interface_decl.extends:
                self.current_java_class.add_extends(sc.name.value)

        return True

    def visit_FieldDeclaration(self, field_decl):
        if self.first_field:
            self.first_field = False

        for var_decl in field_decl.variable_declarators:
            if type(field_decl.type) is str:
                type_name = field_decl.type
            elif type(field_decl.type.name) is str:
                type_name = field_decl.type.name
            else:
                type_name = field_decl.type.name.value

            java_var = JavaVariableBinding(type_name, var_decl.variable.name)
            self.current_java_class.add_field(java_var)

    def visit_MethodDeclaration(self, method_decl):
        if self.first_method:
            self.first_method = False

        java_method = JavaMethod(method_decl.name)

        # Set method visibility
        self.set_method_visibility(java_method, method_decl.modifiers)

        # Set method declaration
        for param in method_decl.parameters:
            if type(param.type) is str:
                param_type = param.type
            elif type(param.type.name) is str:
                param_type = param.type.name
            else:
                param_type = param.type.name.value
            java_method.add_param(JavaVariableBinding(param_type, param.variable.name))

        if type(method_decl.return_type) is str:
            java_method.return_type =  method_decl.return_type
        else:
            try:
                java_method.return_type = method_decl.return_type.name.value
            except:
                java_method.return_type = method_decl.return_type.name

        self.current_java_class.add_method(java_method)

        # Save the method so we can add the body variables to it
        self.current_method = java_method

        return True

    def visit_VariableDeclaration(self, var_declaration):
        for var_decl in var_declaration.variable_declarators:
            if type(var_declaration.type) is str:
                type_name = var_declaration.type
            elif type(var_declaration.type.name) is str:
                type_name = var_declaration.type.name
            else:
                type_name = var_declaration.type.name.value
        local_java_var = JavaVariableBinding(type_name, var_decl.variable.name)

        # If we're in the scope of a method, add that as a variable to the
        # method body
        if self.current_method:
            self.current_method.add_body_var(local_java_var)
        return True

    def set_method_visibility(self, method_obj, modifiers):
        if self.PUBLIC in modifiers:
            method_obj.visibility = self.PUBLIC
        if self.PRIVATE in modifiers:
            method_obj.visibility = self.PRIVATE

    def parse(self, java_file):
        parser = plyj.parser.Parser()
        tree = parser.parse_file(file(java_file))
        if not tree:
            return
        tree.accept(self)
        self.current_java_class.file_name = os.path.basename(java_file)

        return self.current_java_class

